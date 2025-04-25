"use client";

import {
  closestCenter,
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { RowColumn } from "@/components/form-builder/canvas/sortable-row";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Form } from "@/components/ui/form";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useForm } from "react-hook-form";
import { useMemo, memo, useCallback, useState } from "react";
import { Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { RenderEditorComponent } from "../helpers/render-editor-component";
// Memoize the empty state component
const EmptyState = memo(() => (
  <div className="p-6 text-center text-sm text-muted-foreground bg-black/5 rounded-lg max-w-md mx-auto border-dashed border-2 border-slate-300">
    Please add a component to the form
  </div>
));

EmptyState.displayName = "EmptyState";

const getGridRows = (
  items: FormComponentModel[],
  viewport: Viewports
): FormComponentModel[][] => {
  const rows: FormComponentModel[][] = [];
  let currentRow: FormComponentModel[] = [];
  let currentRowSpan = 0;

  items.forEach((item) => {
    const colSpan = +item.getField("properties.style.colSpan", viewport) || 12;

    // If adding this item would exceed 12 columns, start a new row
    if (currentRowSpan + colSpan > 12) {
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
      }
      currentRow = [item];
      currentRowSpan = colSpan;
    } else {
      currentRow.push(item);
      currentRowSpan += colSpan;
    }
  });

  // Add the last row if it has items
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

export function updateColSpans(
  updateItems: FormComponentModel[],
  viewport: Viewports
): { id: string; span: number }[] {
  if (!updateItems.length) return [];

  const totalColumns = 12;
  const itemCount = updateItems.length;

  // Calculate base span and remainder
  const baseSpan = Math.floor(totalColumns / itemCount);
  const remainder = totalColumns % itemCount;

  const adjustedSpans: { id: string; span: number }[] = [];

  // Distribute spans equally, with remainder distributed to first few items
  updateItems.forEach((item, index) => {
    if (!item) return;
    // Add one extra column to the first 'remainder' items
    const span = index < remainder ? baseSpan + 1 : baseSpan;
    adjustedSpans.push({ id: item.id, span });
  });

  return adjustedSpans;
}

export default function GenerateCanvasGrid() {
  // Split store selectors to minimize re-renders
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const mode = useFormBuilderStore((state) => state.mode);
  const form = useForm();
  const updateComponent = useFormBuilderStore((state) => state.updateComponent);
  const moveComponent = useFormBuilderStore((state) => state.moveComponent);
  const viewport = useFormBuilderStore((state) => state.viewport);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = activeId
    ? components.findIndex((component) => component.id === activeId)
    : -1;

  const gridRows = getGridRows(components, viewport);

  // Create sensors outside of callback
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 20,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  // Memoize sensors array
  const sensors = useMemo(
    () => [pointerSensor, keyboardSensor],
    [pointerSensor, keyboardSensor]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      selectComponent(null);
      setActiveId(event.active.id as string);
    },
    [selectComponent]
  );


  // Memoize drag end handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const position = over.data.current.position;
    const activeIndex = active.data.current.index;
    const overIndex = over.data.current.index;

    if (
      (activeIndex === overIndex &&
        (position === "left" || position === "right")) ||
      // Or the diff between active and over is 1
      (activeIndex - overIndex === 1 && position === "bottom") ||
      (overIndex - activeIndex === 1 && position === "top")
    ) {
      return;
    }

    const activeComponent = active.data.current.component;
    const overComponent = over.data.current.component;

    if (activeComponent && overComponent) {
      const overRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === over.data.current?.component.id)
        ) || [];

      const overRowFirstItemIndex = components.findIndex(
        (component) => component.id === overRowItems[0].id
      );

      const overRowLastItemIndex = components.findIndex(
        (component) => component.id === overRowItems[overRowItems.length - 1].id
      );

      let activeRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === active.data.current?.component.id)
        ) || [];

      let draggingInSameRow = overRowItems === activeRowItems;

      // Don´t update the spans if the component is being dragged in the same row
      activeRowItems = activeRowItems.filter(
        (item) => item.id !== activeComponent.id
      );
      let updatedOverItems = [];

      if (position === "top" || position === "bottom") {
        updatedOverItems = updateColSpans([activeComponent], viewport);
      } else {
        updatedOverItems = updateColSpans(
          [...overRowItems, activeComponent],
          viewport
        );
      }

      if (
        (!draggingInSameRow && (position === "left" || position === "right")) ||
        position === "top" ||
        position === "bottom"
      ) {
        updatedOverItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });

        const updatedActiveItems = updateColSpans(
          [...activeRowItems],
          viewport
        );

        updatedActiveItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });
      }

      const oldIndex = active.data.current.index;
      let newIndex =
        position === "left"
          ? overIndex
          : activeIndex < overIndex
            ? overIndex
            : overIndex + 1;

      if (position === "top") {
        newIndex = activeIndex < overIndex ? overRowFirstItemIndex - 1 : overRowFirstItemIndex;
      }

      if (position === "bottom") {
        newIndex = activeIndex < overIndex ? overRowLastItemIndex : overRowLastItemIndex + 1;
      }

      moveComponent(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  if (components.length === 0) {
    return <EmptyState />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    selectComponent(null);
  };

  const activeComponent = activeId
    ? components.find((component) => component.id === activeId)
    : null;

  return (
    <div
      className={`grid grid-cols-12 gap-4`}
      onClick={mode === "editor" ? handleClick : undefined}
    >
      <Form {...form}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          {components.map((component, index) => (
            <RowColumn
              key={component.id}
              component={component}
              index={index}
              form={form}
            />
          ))}
          <DragOverlay className="bg-white/80 shadow outline-1 outline-offset-6 outline-indigo-400 rounded-xs overflow-hidden">
            {activeComponent && (
              <RenderEditorComponent
                key={activeComponent.id}
                component={activeComponent}
                form={form}
              />
            )}
          </DragOverlay>
        </DndContext>
      </Form>
    </div>
  );
}
