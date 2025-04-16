"use client";

import React, { useRef, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { SortableGridItem } from "./SortableGridItem";
import { SortableGridProps, GridItem, OverPosition } from "@/types/GridTypes";
import { getGridRows, updateColSpans } from "./utils";
import { useGridStore } from "@/stores/grid-store";

export const SortableGrid: React.FC<SortableGridProps> = ({
  items: initialItems = [],
  onItemsChange,
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const { 
    items, 
    activeId, 
    overPosition, 
    setItems, 
    setActiveId, 
    setOverPosition,
    moveItem
  } = useGridStore();

  useEffect(() => {
    setMounted(true);
    // Initialize store with initial items if provided
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems, setItems]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const overRect = over.rect;
      const overItem = items.find((item) => item.id === over.id);
      const isFirstItem = items[0].id === over.id;
      const isLastItem = items[items.length - 1].id === over.id;

      if (overRect) {
        const activatorEvent = event.activatorEvent as MouseEvent;
        const initialX = activatorEvent.clientX;
        const initialY = activatorEvent.clientY;

        const relativeX =
          (initialX + event.delta.x - overRect.left) / overRect.width;
        const relativeY =
          (initialY + event.delta.y - overRect.top) / overRect.height;

        if (
          relativeX >= 0.33 &&
          relativeX <= 0.66 &&
          (overItem?.span === 12 ||
            (isFirstItem && overItem?.span !== 12) ||
            (isLastItem && overItem?.span !== 12))
        ) {
          const newOverPosition = relativeY < 0.5 ? "top" : "bottom";
          setOverPosition(newOverPosition);
        } else if (
          relativeX <= 0.33 &&
          relativeX >= 0.66 &&
          (overItem?.span === 12 ||
            (isFirstItem && overItem?.span !== 12) ||
            (isLastItem && overItem?.span !== 12))
        ) {
          const newOverPosition = relativeX < 0.5 ? "left" : "right";
          setOverPosition(newOverPosition);
        } else {
          const newOverPosition = relativeX < 0.5 ? "left" : "right";
          setOverPosition(newOverPosition);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || over.id === active.id || !gridRef.current) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    if (oldIndex === -1) return;

    let newIndex = items.findIndex((item) => item.id === over.id);
    const activeItem = items[oldIndex];
    if (!activeItem) return;

    const { overItemRow, activeItemRow, rowItems } = getGridRows(items, over, active);

    const overItemRowItems = rowItems[overItemRow] || [];
    const activeItemRowItems = (rowItems[activeItemRow] || []).filter(
      (item) => item.id !== activeItem.id
    );

    const isActiveItemInRow = overItemRowItems.some(
      (item) => item.id === activeItem.id
    );

    if (!isActiveItemInRow) {
      overItemRowItems.push(activeItem);
    }

    let newItems = updateColSpans(overItemRowItems, items, activeItem, overPosition);

    if (activeItemRow !== overItemRow) {
      newItems = updateColSpans(activeItemRowItems, newItems, activeItem, null);
    }

    if (
      (overPosition === "right" && oldIndex > newIndex) ||
      (overPosition === "top" && oldIndex < newIndex) ||
      (overPosition === "bottom" && oldIndex > newIndex)
    ) {
      newIndex = newIndex + 1;
    }

    if (overPosition === "left" && oldIndex < newIndex) {
      newIndex = newIndex - 1;
    }

    setItems(newItems);

    // Update items in the store
    moveItem(oldIndex, newIndex);
    onItemsChange?.(newItems);
    setActiveId(null);
  };

  const gridRows = getGridRows(items);

  if (!mounted) {
    return (
      <div className={cn("p-4", className)}>
        <div className="grid grid-cols-12 gap-4 bg-accent p-4 rounded-lg">
          {items.map((item) => (
            <div
              key={item.id}
              className={`col-span-${item.span} bg-white relative p-4 rounded-lg shadow-md border border-gray-200`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className={cn("p-4", className)}>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        collisionDetection={rectIntersection}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={gridRef}
            className="grid grid-cols-12 gap-4 bg-accent p-4 rounded-lg"
          >
            {items.map((item) => (
                <SortableGridItem
                  key={item.id}
                  item={item}
                  gridRows={gridRows.rowItems}
                  overPosition={overPosition}
                />
              )
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && (
            <div className="bg-white relative p-4 rounded-lg shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow opacity-70">
              {items.find((item) => item.id === activeId)?.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

