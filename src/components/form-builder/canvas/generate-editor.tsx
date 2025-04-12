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
import {
  RowColumn,
  SortableRow,
} from "@/components/form-builder/canvas/sortable-row";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Form } from "@/components/ui/form";
import { SortableContext } from "@dnd-kit/sortable";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useForm } from "react-hook-form";
import { useMemo, memo, useCallback, useState } from "react";
import { FormRow } from "@/types/form-builder.types";
import { getComponentViews } from "@/config/available-components";
import { FormComponentModel } from "@/models/FormComponent";
// Memoize the empty state component
const EmptyState = memo(() => (
  <div className="p-6 text-center text-sm text-muted-foreground bg-black/5 rounded-lg max-w-md mx-auto border-dashed border-2 border-slate-300">
    Please add a component to the form
  </div>
));

EmptyState.displayName = "EmptyState";

export default function GenerateEditor() {
  // Split store selectors to minimize re-renders
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const mode = useFormBuilderStore((state) => state.mode);
  const form = useForm();
  const updateComponents = useFormBuilderStore(
    (state) => state.updateComponents
  );
  const updateComponent = useFormBuilderStore((state) => state.updateComponent);
  const moveComponent = useFormBuilderStore((state) => state.moveComponent);
  const viewport = useFormBuilderStore((state) => state.viewport);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = activeId
    ? components.findIndex((component) => component.id === activeId)
    : -1;

  const [overPosition, setOverPosition] = useState<
    "left" | "right" | "top" | "bottom" | null
  >(null);

  // Create sensors outside of callback
  const pointerSensor = useSensor(PointerSensor);
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  // Memoize sensors array
  const sensors = useMemo(
    () => [pointerSensor, keyboardSensor],
    [pointerSensor, keyboardSensor]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragMove = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const overRect = over.rect;

      if (overRect) {
        const cursorX = event.delta.x + overRect.left;
        const cursorY = event.delta.y + overRect.top;

        const relativeX = (cursorX - overRect.left) / overRect.width;
        const relativeY = (cursorY - overRect.top) / overRect.height;

        // Only show top/bottom if in middle third horizontally
        if (relativeX >= 0.33 && relativeX <= 0.66) {
          setOverPosition(relativeY < 0.5 ? "top" : "bottom");
        } else {
          setOverPosition(relativeX < 0.5 ? "left" : "right");
        }
      }
    }
  };

  // Memoize drag end handler
  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;

      if (active.id !== over.id) {
        console.log("dropped", overPosition);

        // Handle left/right position by adjusting colSpans
        if (overPosition === "left" || overPosition === "right") {
          const activeComponent = components.find(
            (component) => component.id === active.id
          );
          const overComponent = components.find(
            (component) => component.id === over.id
          );

          if (activeComponent && overComponent) {
            const activeColSpan = activeComponent.getField(
              "properties.style.colSpan",
              viewport
            );
            const overColSpan = overComponent.getField(
              "properties.style.colSpan",
              viewport
            );

            console.log(activeColSpan, overColSpan);

            updateComponent(
              activeComponent.id,
              "properties.style.colSpan",
              activeColSpan / 2
            );
            updateComponent(
              overComponent.id,
              "properties.style.colSpan",
              overColSpan / 2
            );

            const oldIndex = components.findIndex(
              (component) => component.id === active.id
            );
            let newIndex = components.findIndex(
              (component) => component.id === over.id
            );

            newIndex = overPosition === "left" ? newIndex : newIndex + 1;

            moveComponent(oldIndex, newIndex);
          }
        }
      }
      setActiveId(null);
    },
    [components, updateComponents, overPosition, viewport, updateComponent]
  );

  if (components.length === 0) {
    return <EmptyState />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    selectComponent(null);
  };



  const activeComponent = activeId
    ? components.find((component) => component.id === activeId)
    : null;
  const componentViews = activeComponent
    ? getComponentViews(activeComponent)
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
          onDragMove={handleDragMove}
        >
          <SortableContext
            items={components.map((component) => component.id)}
            strategy={verticalListSortingStrategy}
          >
            {components.map((component, index) => (
              <RowColumn
                key={component.id}
                component={component}
                index={index}
                form={form}
                activeIndex={activeIndex}
                overPosition={overPosition}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            <div>{activeComponent ? componentViews?.render : null}</div>
          </DragOverlay>
        </DndContext>
      </Form>
    </div>
  );
}
