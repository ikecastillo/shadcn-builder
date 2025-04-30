"use client";

import { RowColumn } from "@/components/form-builder/canvas/sortable-row";
import { Form } from "@/components/ui/form";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useForm } from "react-hook-form";
import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
// Memoize the empty state component
const EmptyState = memo(() => {
  const { setNodeRef, isOver } = useDroppable({
    id: "empty-state",
    data: {
      index: 0,
    },
  });

  console.log(isOver);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-6 text-center text-sm text-muted-foreground bg-black/5 rounded-lg max-w-md mx-auto border-dashed border-2 border-slate-300",
        isOver && "border-primary"
      )}
    >
      Please add a component to the form
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export default function GenerateCanvasGrid() {
  // Split store selectors to minimize re-renders
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const mode = useFormBuilderStore((state) => state.mode);
  const form = useForm();

  if (components.length === 0) {
    return <EmptyState />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    selectComponent(null);
  };

  return (
    <div
      className={`grid grid-cols-12 gap-4`}
      onClick={mode === "editor" ? handleClick : undefined}
    >
      <Form {...form}>
        {components.map((component, index) => (
          <RowColumn
            key={component.id}
            component={component}
            index={index}
            form={form}
          />
        ))}
      </Form>
    </div>
  );
}
