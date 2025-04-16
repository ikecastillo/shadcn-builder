import { SortableGrid } from '@/components/form-builder/canvas/grid/SortableGrid';
import { GridItem } from '@/types/GridTypes';

export default function SortableGridPage() {

  const defaultItems: GridItem[] = [
    { id: "1", content: <input />, span: 12 },
    { id: "2", content: <input />, span: 6 },
    { id: "3", content: <input />, span: 6 },
    { id: "4", content: <input />, span: 8 },
    { id: "5", content: <input />, span: 4 },
    { id: "6", content: <input />, span: 4 },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Sortable 12-Column Grid</h1>
      <p className="text-gray-600 mb-8">
        Drag and drop the columns to reorder them. Each column has a different span width.
      </p>
      <SortableGrid items={defaultItems} />
    </div>
  );
} 
