import { SortableGrid } from '@/components/SortableGrid';

export default function SortableGridPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Sortable 12-Column Grid</h1>
      <p className="text-gray-600 mb-8">
        Drag and drop the columns to reorder them. Each column has a different span width.
      </p>
      <SortableGrid />
    </div>
  );
} 
