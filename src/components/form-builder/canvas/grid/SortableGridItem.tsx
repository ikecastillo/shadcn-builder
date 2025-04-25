import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortableGridItemProps } from "../../../../types/GridTypes";
import { useEffect, useRef, memo, useCallback } from "react";
import { getGridRows, getItemRow } from "./utils";
import { useGridStore } from "@/stores/grid-store";

export const SortableGridItem = memo<SortableGridItemProps>(({
  item,
  gridRows,
  overPosition,
}) => {
  const { attributes, listeners, setNodeRef, isDragging, over, active } =
    useSortable({ id: item.id });

  const { updateItem } = useGridStore();

  

  const resizeLeftRef = useRef<HTMLDivElement>(null);
  const resizeRightRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startSpan = useRef(item.span);
  const endSpan = useRef(item.span);
  const previousItemStartSpan = useRef(0);
  const previousItemEndSpan = useRef(0);
  const nextItemStartSpan = useRef(0);
  const nextItemEndSpan = useRef(0);
  const itemWidth = useRef(0);
  const isResizing = useRef(false);
  const resizeHandle = useRef<"left" | "right" | null>(null);
  const previousItemEl = useRef<HTMLElement | null>(null);
  const nextItemEl = useRef<HTMLElement | null>(null);
  const itemRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !itemRef.current) return;

    const cellWidth = itemWidth.current / item.span;
    const moveDelta = e.clientX - startX.current;
    const moveDiff = Math.abs(moveDelta);
    const isMovingLeft = moveDelta < 0;
    const isMovingRight = moveDelta > 0;
    let colSpanDiff = Math.ceil(moveDiff / cellWidth);

    if (moveDiff >= cellWidth / 2) {
      if (resizeHandle.current === "left") {
        if (previousItemStartSpan.current > 0 && previousItemEl.current) {
          if (isMovingLeft) {
            previousItemEndSpan.current = Math.max(
              1,
              Math.min(12, previousItemStartSpan.current - colSpanDiff)
            );
            endSpan.current = Math.max(
              1,
              Math.min(12, startSpan.current + colSpanDiff)
            );
            previousItemEl.current.style.gridColumn = `span ${previousItemEndSpan.current} / span ${previousItemEndSpan.current}`;
            itemRef.current.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
          } else {
            previousItemEndSpan.current = Math.max(
              1,
              Math.min(12, previousItemStartSpan.current + colSpanDiff)
            );
            endSpan.current = Math.max(
              1,
              Math.min(12, startSpan.current - colSpanDiff)
            );
            previousItemEl.current.style.gridColumn = `span ${previousItemEndSpan.current} / span ${previousItemEndSpan.current}`;
            itemRef.current.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
          }
          return;
        }
      }

      if (resizeHandle.current === "right") {
        if (nextItemStartSpan.current > 0 && nextItemEl.current) {
          if (isMovingLeft) {
            nextItemEndSpan.current = Math.max(
              1,
              Math.min(12, nextItemStartSpan.current + colSpanDiff)
            );
            endSpan.current = Math.max(
              1,
              Math.min(12, startSpan.current - colSpanDiff)
            );
            nextItemEl.current.style.gridColumn = `span ${nextItemEndSpan.current} / span ${nextItemEndSpan.current}`;
            itemRef.current.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
          } else {
            nextItemEndSpan.current = Math.max(
              1,
              Math.min(12, nextItemStartSpan.current - colSpanDiff)
            );
            endSpan.current = Math.max(
              1,
              Math.min(12, startSpan.current + colSpanDiff)
            );
            nextItemEl.current.style.gridColumn = `span ${nextItemEndSpan.current} / span ${nextItemEndSpan.current}`;
            itemRef.current.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
          }
          return;
        }

        endSpan.current = Math.max(
          1,
          Math.min(12, startSpan.current - colSpanDiff)
        );
        itemRef.current.style.gridColumn = `span ${endSpan.current} / span ${endSpan.current}`;
      }
    }
  }, [item.span]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "";
    updateItem(item.id, { span: endSpan.current });
    if (previousItemEl.current && previousItemEndSpan.current !== previousItemStartSpan.current) {
      const previousItem = getItemRow(gridRows, item.id).previousItem;
      if (previousItem) {
        updateItem(previousItem.id, { span: previousItemEndSpan.current });
      }
    }
    if (nextItemEl.current && nextItemEndSpan.current !== nextItemStartSpan.current) {
      const nextItem = getItemRow(gridRows, item.id).nextItem;
      if (nextItem) {
        updateItem(nextItem.id, { span: nextItemEndSpan.current });
      }
    }
    setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.style.gridColumn = ``;
      }
      if (previousItemEl.current) {
        previousItemEl.current.style.gridColumn = ``;
      }
      if (nextItemEl.current) {
        nextItemEl.current.style.gridColumn = ``;
      }
    }, 100);
  }, [gridRows, item.id, updateItem]);

  const handleMouseDown = useCallback((e: MouseEvent, resizeHandler?: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();

    const { previousItem, nextItem } = getItemRow(gridRows, item.id);
    const currentItemRef = document.getElementById(`grid-row-item-${item.id}`);
    
    if (!currentItemRef) return;

    isResizing.current = true;
    startX.current = e.clientX;
    startSpan.current = item.span;
    itemWidth.current = currentItemRef.clientWidth;
    previousItemStartSpan.current = previousItem?.span || 0;
    nextItemStartSpan.current = nextItem?.span || 0;
    previousItemEndSpan.current = previousItem?.span || 0;
    nextItemEndSpan.current = nextItem?.span || 0;
    document.body.style.cursor = "ew-resize";
    resizeHandle.current = resizeHandler || null;
    itemRef.current = currentItemRef;
    previousItemEl.current = previousItem ? document.getElementById(`grid-row-item-${previousItem.id}`) : null;
    nextItemEl.current = nextItem ? document.getElementById(`grid-row-item-${nextItem.id}`) : null;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [gridRows, item.id, item.span, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const leftHandle = resizeLeftRef.current;
    const rightHandle = resizeRightRef.current;

    if (leftHandle) {
      leftHandle.addEventListener("mousedown", (e) => handleMouseDown(e, "left"));
    }

    if (rightHandle) {
      rightHandle.addEventListener("mousedown", (e) => handleMouseDown(e, "right"));
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
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);

  return (
    <div
      id={`grid-row-item-${item.id}`}
      className={cn(
        `group/item col-span-${item.span} relative bg-white rounded-lg shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow`
      )}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(`p-4`, isDragging && "opacity-20")}
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
});

SortableGridItem.displayName = "SortableGridItem";
