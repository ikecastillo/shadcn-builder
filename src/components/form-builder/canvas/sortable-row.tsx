import { UseFormReturn } from "react-hook-form";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, generateTWClassesForAllViewports } from "@/lib/utils";
import { RenderEditorComponent } from "../helpers/render-editor-component";
import { DropdownComponents } from "../helpers/dropdown-components";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Over, useDraggable, useDroppable } from "@dnd-kit/core";
import { FormComponentModel } from "@/models/FormComponent";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";

interface SortableRowProps {
  component: FormComponentModel;
  index: number;
  form: UseFormReturn<any>;
  activeIndex: number;
}

// Memoize the row dropzone component
const RowDropzone = memo(
  ({
    newRow,
    position,
    rowId,
  }: {
    newRow?: boolean;
    position?: "before" | "after";
    rowId: number;
  }) => (
    <div className="flex items-center justify-center absolute mx-8 group-hover/row:opacity-100 opacity-0 border-t border-indigo-200 -bottom-3 -left-2 -right-2">
      <DropdownComponents
        newRow={newRow}
        {...(position === "before" ? { before: rowId } : { after: rowId })}
        className="z-10 absolute bg-indigo-200 rounded-full"
      />
    </div>
  )
);

RowDropzone.displayName = "RowDropzone";

// Memoize the draggable button component
const DraggableButton = memo(({ attributes, listeners }: any) => (
  <div
    className="h-6 w-6 cursor-grab active:cursor-grabbing self-center group-hover/row:opacity-100 opacity-0 flex items-center justify-center"
    {...attributes}
    {...listeners}
  >
    <GripVertical className="h-4 w-4 text-slate-400" />
  </div>
));

DraggableButton.displayName = "DraggableButton";

// Memoize the row column component
export const RowColumn = ({
  component,
  index,
  form,
}: {
  component: FormComponentModel;
  index: number;
  form: UseFormReturn<any>;
}) => {
  const {
    attributes: columnAttributes,
    listeners: columnListeners,
    setNodeRef,
    transform: columnTransform,
    isDragging: columnIsDragging,
    over: columnOver,
    active: columnActive,
  } = useDraggable({
    id: component.id,
    data: {
      component,
      index,
    },
  });

  const selectedComponent = useFormBuilderStore(
    (state) => state.selectedComponent
  );
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const removeComponent = useFormBuilderStore((state) => state.removeComponent);
  const mode = useFormBuilderStore((state) => state.mode);

  const columnStyle = useMemo(
    () => ({
      columnTransform,
      zIndex: columnIsDragging ? 30 : 1,
      ...(selectedComponent?.id === component.id ? { zIndex: 30 } : undefined),
    }),
    [columnTransform, columnIsDragging, selectedComponent, component]
  );

  const colSpanClasses = useMemo(
    () => generateTWClassesForAllViewports(component, "colSpan"),
    [component]
  );

  const colStartClasses = useMemo(
    () => generateTWClassesForAllViewports(component, "colStart"),
    [component]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      console.log("columnIsDragging", columnIsDragging);
      if (mode === "editor" && !columnIsDragging) {
        e.stopPropagation();
        selectComponent(component);
      }
    },
    [component, selectComponent, mode, columnIsDragging]
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative group",
        colSpanClasses,
        colStartClasses,
        mode === "editor" && "group/component"
      )}
      key={component.id}
      data-component-id={component.id}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 bottom-0 cursor-pointer hover:outline-1 hover:outline-offset-6 hover:outline-slate-400 rounded-xs",
          columnIsDragging && "cursor-grabbing",
          mode === "preview" && "hidden"
        )}
        style={columnStyle}
        onClick={handleClick}
        {...columnAttributes}
        {...columnListeners}
      >
        <RowColumnDropzone
          index={index}
          position={"left"}
          overColumn={columnOver}
          component={component}
        />
        <RowColumnDropzone
          index={index}
          position={"right"}
          overColumn={columnOver}
          component={component}
        />
        <RowColumnDropzone
          index={index}
          position={"top"}
          overColumn={columnOver}
          component={component}
        />
        <RowColumnDropzone
          index={index}
          position={"bottom"}
          overColumn={columnOver}
          component={component}
        />

        <Button
          variant="link"
          size="icon"
          className={cn(
            "h-8 w-8 absolute right-0 -top-2 m-0! text-slate-500 hover:text-red-500 group-hover/component:opacity-100 opacity-0 cursor-pointer",
            component.id === selectedComponent?.id && "opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
        >
          <Icons.Trash2Icon className="h-4 w-4" />
        </Button>
      </div>

      <RenderEditorComponent
        key={component.id}
        component={component}
        form={form}
      />
    </div>
  );
};

RowColumn.displayName = "RowColumn";

const RowColumnDropzone = ({
  index,
  position,
  overColumn,
  component,
}: {
  index: number;
  position: "left" | "right" | "top" | "bottom" | null;
  overColumn: Over | null;
  component: FormComponentModel;
}) => {
  const customId = `${index}-${position}`;
  const overColumnId = overColumn?.id;
  const { setNodeRef } = useDroppable({
    id: customId,
    data: {
      index,
      position,
      component,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        " bg-indigo-500 absolute opacity-0 rounded-full",
        overColumnId === customId && "opacity-100",
        position === "top" && "left-0 -top-2.25 right-0 h-0.5",
        position === "bottom" && "left-0 -bottom-2.25 right-0 h-0.5",
        position === "left" && "-left-2.25 top-0 bottom-0 w-0.5",
        position === "right" && "-right-2.25 top-0 bottom-0 w-0.5"
      )}
    ></div>
  );
};

RowColumnDropzone.displayName = "RowColumnDropzone";
