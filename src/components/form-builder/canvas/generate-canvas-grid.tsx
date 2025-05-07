"use client";

import { RowColumn } from "@/components/form-builder/canvas/sortable-row";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useForm } from "react-hook-form";
import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { getZodSchemaForComponents, getZodDefaultValues } from "@/components/form-builder/helpers/zod";
// Memoize the empty state component
const EmptyState = memo(() => {
  const { setNodeRef, isOver } = useDroppable({
    id: "empty-state",
    data: {
      index: 0,
    },
  });

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

  const formSchema = getZodSchemaForComponents(components);
  const defaultValues = getZodDefaultValues(components);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  if (components.length === 0) {
    return <EmptyState />;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    selectComponent(null);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 @container"
      >
        <div
          className={`grid grid-cols-12 gap-4`}
          onClick={mode === "editor" ? handleClick : undefined}
        >
          {components.map((component, index) => (
            <RowColumn
              key={component.id}
              component={component}
              index={index}
              form={form}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}
