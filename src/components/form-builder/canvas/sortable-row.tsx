import { UseFormReturn } from "react-hook-form";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, generateTWClassesForAllViewports } from "@/lib/utils";
import { RenderEditorComponent } from "../helpers/render-editor-component";
import { DropdownComponents } from "../helpers/dropdown-components";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { FormRow, Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { memo, useCallback, useEffect, useMemo } from "react";

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
export const RowColumn = memo(
  ({
    component,
    index,
    form,
    activeIndex,
    overPosition,
  }: {
    component: FormComponentModel;
    index: number;
    form: UseFormReturn<any>;
    activeIndex: number;
    overPosition: "left" | "right" | "top" | "bottom" | null;
  }) => {
    const {
      attributes: columnAttributes,
      listeners: columnListeners,
      setNodeRef,
      transform: columnTransform,
      transition: columnTransition,
      isDragging: columnIsDragging,
      over: columnOver,
    } = useSortable({
      id: component.id,
    });

    const selectedComponent = useFormBuilderStore(
      (state) => state.selectedComponent
    );
    const selectComponent = useFormBuilderStore(
      (state) => state.selectComponent
    );
    const mode = useFormBuilderStore((state) => state.mode);
    const columnStyle = useMemo(
      () => ({
        transform: columnTransform
          ? `translate3d(${columnTransform.x}px, 0, 0)`
          : undefined,
        transition: columnTransition,
        zIndex: columnIsDragging ? 30 : 1,
        ...(selectedComponent?.id === component.id
          ? { zIndex: 30 }
          : undefined),
      }),
      [
        columnTransform,
        columnTransition,
        columnIsDragging,
        selectedComponent,
        component,
      ]
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
          "relative group cursor-pointer ",
          colSpanClasses,
          colStartClasses,
        )}
        style={columnStyle}
        key={component.id}
        onClick={handleClick}
        data-component-id={component.id}
      >
        {columnOver?.id === component.id && (
          <RowColumnDropzone
            activeIndex={activeIndex}
            index={index}
            overPosition={overPosition}
          />
        )}
        <RenderEditorComponent
          key={component.id}
          index={index}
          component={component}
          form={form}
          dndAttributes={columnAttributes}
          dndListeners={columnListeners}
        />
      </div>
    );
  }
);

RowColumn.displayName = "RowColumn";

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
