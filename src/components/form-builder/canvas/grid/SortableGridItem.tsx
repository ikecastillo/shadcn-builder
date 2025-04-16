import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortableGridItemProps } from "../../../../types/GridTypes";
import { useEffect, useRef, useState } from "react";
import { getGridRows, getItemRow } from "./utils";
import { useGridStore } from "@/stores/grid-store";
export const SortableGridItem: React.FC<SortableGridItemProps> = ({
  item,
  gridRows,
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
  } = useSortable({ id: item.id });

  const { updateItem } = useGridStore();

  const resizeLeftRef = useRef<HTMLDivElement>(null);
  const resizeRightRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startSpan = useRef(item.span);
  const endSpan = useRef(item.span);
  const itemWidth = useRef(0);
  const [colSpan, setColSpan] = useState(item.span);

  useEffect(() => {
    setColSpan(item.span);
    console.log("colSpan", colSpan);
  }, [item.span]);

  useEffect(() => {
    // Find all items in the same row as the item
    const { previousItem, nextItem, rowItems } = getItemRow(gridRows, item.id);

    let previousItemWidth = 0;
    let nextItemWidth = 0;
    let isResizing = false;
    console.log("rerender");

    const previousItemEl = document.getElementById(
      `grid-row-item-${previousItem?.id}`
    );
    const nextItemEl = document.getElementById(`grid-row-item-${nextItem?.id}`);
    const itemRef = document.getElementById(`grid-row-item-${item.id}`);

    if (!itemRef) return;

    const handleMouseDown = (e: MouseEvent) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      startX.current = e.clientX;
      startSpan.current = item.span;
      itemWidth.current = itemRef?.clientWidth || 0;
      previousItemWidth = previousItemEl?.clientWidth || 0;
      nextItemWidth = nextItemEl?.clientWidth || 0;
      document.body.style.cursor = "ew-resize";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !itemRef) return;

      const cellWidth = itemWidth.current / item.span;
      const moveDelta = e.clientX - startX.current;
      const moveDiff = Math.abs(moveDelta);
      const isMovingLeft = moveDelta < 0;
      const isMovingRight = moveDelta > 0;
      let colSpanDiff = Math.ceil(moveDiff / cellWidth);

      if (isMovingLeft && moveDiff >= cellWidth / 2) {
        endSpan.current = Math.max(
          1,
          Math.min(12, startSpan.current - colSpanDiff)
        );
        itemRef.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
      }

      if (isMovingRight && moveDiff >= cellWidth / 2) {
        endSpan.current = Math.max(
          1,
          Math.min(12, startSpan.current + colSpanDiff)
        );
        itemRef.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = "";
      updateItem(item.id, { span: endSpan.current });
      setTimeout(() => {
        itemRef.style.gridColumn = ``;
      }, 100);
    };

    const leftHandle = resizeLeftRef.current;
    const rightHandle = resizeRightRef.current;

    if (leftHandle) {
      leftHandle.addEventListener("mousedown", handleMouseDown);
    }
    if (rightHandle) {
      rightHandle.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (leftHandle) {
        leftHandle.removeEventListener("mousedown", handleMouseDown);
      }
      if (rightHandle) {
        rightHandle.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [gridRows, item, updateItem]);

  return (
    <div
      id={`grid-row-item-${item.id}`}
      className={cn(
        `group/item col-span-${colSpan}  relative bg-white rounded-lg shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow`
      )}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(` p-4 `, isDragging && "opacity-20")}
      >
        {over?.id === item.id && over.id !== active?.id && (
          <div
            className={cn(
              "bg-indigo-500 absolute",
              overPosition === "top" && "left-0 -top-2.25 right-0 h-0.5",
              overPosition === "bottom" && "left-0 -bottom-2.25 right-0 h-0.5",
              overPosition === "left" && "-left-2.25 top-0 bottom-0 w-0.5",
              overPosition === "right" && "-right-2.75 top-0 bottom-0 w-0.5"
            )}
          />
        )}
        {item.id}
      </div>
      <div
        ref={resizeLeftRef}
        className="w-0.5 h-full bg-indigo-500 absolute left-0 top-0 cursor-ew-resize opacity-0 group-hover/item:opacity-100 transition-opacity"
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
      />
      <div
        ref={resizeRightRef}
        className="w-0.5 h-full bg-indigo-500 absolute right-0 top-0 cursor-ew-resize opacity-0 group-hover/item:opacity-100 transition-opacity"
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
      />
    </div>
  );
};
