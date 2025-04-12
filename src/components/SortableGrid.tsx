"use client";

import React, { memo, useMemo, useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
  MeasuringConfiguration,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragMoveEvent,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface GridItem {
  id: string;
  content: string;
  span: number;
}

interface SortableGridItemProps {
  id: string;
  content: string;
  span: number;
  index: number;
  activeIndex: number;
  overPosition: "left" | "right" | "top" | "bottom" | null;
}

const SortableGridItem: React.FC<SortableGridItemProps> = ({
  id,
  content,
  span,
  index,
  activeIndex,
  overPosition,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
    active,
    isSorting,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
      }}
      {...attributes}
      {...listeners}
      className={cn(
        `col-span-${span} bg-white relative p-4 rounded-lg shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow`,
        over?.id === id && "bg-indigo-500"
      )}
    >
      {over?.id === id && over.id !== active?.id && (
        <RowColumnDropzone
          activeIndex={activeIndex}
          index={index}
          overPosition={overPosition}
        />
      )}
      {content}
    </div>
  );
};

export const SortableGrid: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [items, setItems] = useState<GridItem[]>([
    { id: "1", content: "Column 1", span: 12 },
    { id: "2", content: "Column 2", span: 6 },
    { id: "3", content: "Column 3", span: 6 },
    { id: "4", content: "Column 4", span: 8 },
    { id: "5", content: "Column 5", span: 4 },
  ]);

  const [tempItems, setTempItems] = useState<GridItem[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeIndex = activeId
    ? items.findIndex((item) => item.id === activeId)
    : -1;

  const [overPosition, setOverPosition] = useState<
    "left" | "right" | "top" | "bottom" | null
  >(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems(() => {
        const oldIndex = tempItems.findIndex((item) => item.id === active.id);
        let newIndex = tempItems.findIndex((item) => item.id === over.id);

        if (overPosition === "right" && oldIndex > newIndex) {
          newIndex = newIndex + 1;
        }

        console.log("newIndex", newIndex);

        const newItems = [...tempItems];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        return newItems;
      });
    }
    setActiveId(null);
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const overRect = over.rect;

      if (overRect) {
        // Get the initial mouse position from the activator event
        const activatorEvent = event.activatorEvent as MouseEvent;
        const initialX = activatorEvent.clientX;
        const initialY = activatorEvent.clientY;

        // Calculate relative position within the over element
        const relativeX =
          (initialX + event.delta.x - overRect.left) / overRect.width;
        const relativeY =
          (initialY + event.delta.y - overRect.top) / overRect.height;

        // Only show top/bottom if in middle third horizontally
        if (relativeX >= 0.33 && relativeX <= 0.66) {
          const newOverPosition = relativeY < 0.5 ? "top" : "bottom";
          setOverPosition(newOverPosition);
        } else {
          const newOverPosition = relativeX < 0.5 ? "left" : "right";
          setOverPosition(newOverPosition);
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === active.id || !gridRef.current) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    if (oldIndex === -1) return; // Item not found

    const activeItem = items[oldIndex];
    if (!activeItem) return; // Active item not found

    // Calculate the actual grid position by tracking accumulated spans
    let currentRow = 0;
    let currentRowColSpan = 0;
    let rowItems: GridItem[][] = [];
    let overItemRow = 0;
    let activeItemRow = 0;

    // First, find all items in the same row as the target item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;

      if (item.id === over.id) {
        overItemRow = currentRow;
      }

      if (item.id === active.id) {
        activeItemRow = currentRow;
      }

      if (item.span < 12 && currentRowColSpan < 12) {
        currentRowColSpan += item.span;
        if (rowItems[currentRow]) {
          rowItems[currentRow].push(item);
        } else {
          rowItems = [...rowItems, [item]];
        }
        if (currentRowColSpan === 12) {
          currentRow++;
          currentRowColSpan = 0;
        }
      } else {
        currentRow++;
        currentRowColSpan = 0;
        rowItems = [...rowItems, [item]];
      }
    }

    // Get the items in the row of the over item
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

    const updateColSpans = (updateItems: GridItem[], items: GridItem[]) => {
      if (!updateItems.length || !items.length) return items;

      // Calculate total span of items in the row including the active item
      const totalSpan = updateItems.reduce((acc, item) => {
        if (!item) return acc;
        return acc + (item.span || 1);
      }, 0);

      if (totalSpan === 0) return items;

      // If total span exceeds 12, adjust spans proportionally
      const scaleFactor = 12 / totalSpan;

      // Create new items array with adjusted spans
      const newItems = [...items];
      const adjustedSpans: { id: string; span: number }[] = [];

      // First pass: calculate scaled spans
      updateItems.forEach((item) => {
        if (!item) return;
        const scaledSpan = Math.max(1, Math.round((item.span || 1) * scaleFactor));
        adjustedSpans.push({ id: item.id, span: scaledSpan });
      });

      // Calculate the sum of adjusted spans
      let sumAdjustedSpans = adjustedSpans.reduce(
        (sum, item) => sum + item.span,
        0
      );

      // Adjust the last item to make the total exactly 12
      if (sumAdjustedSpans !== 12 && adjustedSpans.length > 0) {
        const diff = 12 - sumAdjustedSpans;
        adjustedSpans[adjustedSpans.length - 1].span += diff;
      }

      // Apply the adjusted spans to the new items array
      adjustedSpans.forEach(({ id, span }) => {
        const itemIndex = items.findIndex((i) => i?.id === id);
        if (itemIndex !== -1 && items[itemIndex]) {
          newItems[itemIndex] = { ...items[itemIndex], span };
        }
      });

      return newItems;
    };

    let newItems = updateColSpans(overItemRowItems, items);

    if (activeItemRow !== overItemRow) {
      newItems = updateColSpans(activeItemRowItems, newItems);
    }

    setTempItems(newItems);
  };

  if (!mounted) {
    return (
      <div className="p-4">
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
    <div className="p-4">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
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
            {items.map((item, index) => (
              <SortableGridItem
                key={item.id}
                id={item.id}
                content={item.content}
                span={item.span}
                index={index}
                activeIndex={activeIndex}
                overPosition={overPosition}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          <div className="bg-accent p-4 rounded-lg opacity-50">
            <p>Dragging</p>
          </div>
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const RowColumnDropzone = memo(
  ({
    activeIndex,
    index,
    overPosition,
  }: {
    activeIndex: number;
    index: number;
    overPosition: "left" | "right" | "top" | "bottom" | null;
  }) => {
    return (
      <div
        className={cn(
          " bg-indigo-500 absolute",
          overPosition === "top" && "left-0 -top-1.5 right-0 h-0.5",
          overPosition === "bottom" && "left-0 -bottom-1.5 right-0 h-0.5",
          overPosition === "left" && "-left-1.5 top-0 bottom-0 w-0.5",
          overPosition === "right" && "-right-1.5 top-0 bottom-0 w-0.5"
        )}
      ></div>
    );
  }
);

RowColumnDropzone.displayName = "RowColumnDropzone";
