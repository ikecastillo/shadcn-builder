import { Over, Active } from "@dnd-kit/core";
import { GridItem, GridRows, OverPosition } from "../../../../types/GridTypes";

export function getGridRows(
  items: GridItem[],
  over?: Over,
  active?: Active
): GridRows {
  let currentRow = 0;
  let currentRowColSpan = 0;
  let rowItems: GridItem[][] = [];
  let overItemRow = 0;
  let activeItemRow = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;

    if (over && item.id === over.id) {
      overItemRow = currentRow;
    }

    if (active && item.id === active.id) {
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
  return { overItemRow, activeItemRow, rowItems };
}

export function getItemRow(
  gridRows: GridRows["rowItems"],
  itemId: string
): {
  previousItem: GridItem | null;
  nextItem: GridItem | null;
  rowItems: GridItem[];
} {
  const rowItems =
    gridRows.find((row) => row.some((gridItem) => gridItem.id === itemId)) ||
    [];
  const itemIndex = rowItems.findIndex((item) => item.id === itemId);
  const previousItem = rowItems[itemIndex - 1];
  const nextItem = rowItems[itemIndex + 1];

  

  return { previousItem, nextItem, rowItems };
}

export function updateColSpans(
  updateItems: GridItem[],
  items: GridItem[],
  activeItem: GridItem,
  overPosition: OverPosition
): GridItem[] {
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


  if (overPosition === "top" || overPosition === "bottom") {
    const activeItemIndex = newItems.findIndex(
      (item) => item.id === activeItem.id
    );
    if (activeItemIndex !== -1) {
      newItems[activeItemIndex] = { ...newItems[activeItemIndex], span: 12 };
    }
  } else {
    const adjustedSpans: { id: string; span: number }[] = [];

    // First pass: calculate scaled spans
    updateItems.forEach((item) => {
      if (!item) return;
      const scaledSpan = Math.max(
        1,
        Math.round((item.span || 1) * scaleFactor)
      );
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
  }


  return newItems;
}
