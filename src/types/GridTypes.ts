import { Over, Active } from "@dnd-kit/core";
import { ReactNode } from "react";

export interface GridItem {
  id: string;
  content: ReactNode;
  span: number;
}

export type OverPosition = "left" | "right" | "top" | "bottom" | null;

export interface SortableGridItemProps {
  item: GridItem;
  gridRows: GridRows["rowItems"];
  overPosition: OverPosition;
  onResize?: (id: string, newSpan: number) => void;
}

export interface GridRows {
  overItemRow: number;
  activeItemRow: number;
  rowItems: GridItem[][];
}

export interface SortableGridProps {
  items?: GridItem[];
  onItemsChange?: (items: GridItem[]) => void;
  className?: string;
} 
