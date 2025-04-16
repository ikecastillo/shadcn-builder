import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GridItem } from '@/types/GridTypes';

interface GridStore {
  items: GridItem[];
  activeId: string | null;
  overPosition: 'left' | 'right' | 'top' | 'bottom' | null;
  setItems: (items: GridItem[]) => void;
  setActiveId: (id: string | null) => void;
  setOverPosition: (position: 'left' | 'right' | 'top' | 'bottom' | null) => void;
  updateItem: (id: string, updates: Partial<GridItem>) => void;
  moveItem: (oldIndex: number, newIndex: number) => void;
  addItem: (item: GridItem) => void;
  removeItem: (id: string) => void;
}

export const useGridStore = create<GridStore>()(
  persist(
    (set) => ({
      items: [],
      activeId: null,
      overPosition: null,
      setItems: (items) => set({ items }),
      setActiveId: (id) => set({ activeId: id }),
      setOverPosition: (position) => set({ overPosition: position }),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      moveItem: (oldIndex, newIndex) =>
        set((state) => {
          const items = [...state.items];
          const [movedItem] = items.splice(oldIndex, 1);
          items.splice(newIndex, 0, movedItem);
          return { items };
        }),
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'grid-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
); 
