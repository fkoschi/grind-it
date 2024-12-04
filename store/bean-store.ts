import { create } from "zustand";

type State = {
  taste: Array<string>; // Intermediate state for creating a new Bean. Once the Bean is created, the list of tastes is going to be stored into the DB.
  tasteFilter: Array<number>; // Used on Dashboard to filter for certain taste types
  editRoastery: boolean; // Used to handle the BottomSheet
  editBeanTaste: boolean; // Used to handle the BottomSheet
};
type Action = {
  updateEditRoastery: (state: State["editRoastery"]) => void;
  updateEditBeanTaste: (state: State["editBeanTaste"]) => void;

  // Bean Taste
  addBeanTaste: (item: string) => void;
  removeBeanTaste: (item: string) => void;
  clearBeanTaste: () => void;

  // Bean Taste Filter
  addBeanTasteFilter: (filterId: number) => void;
  removeBeanTasteFilter: (filterId: number) => void;
  clearBeanTasteFilter: () => void;
};
export const useBeanStore = create<State & Action>((set) => ({
  taste: [],
  tasteFilter: [],
  editRoastery: false,
  editBeanTaste: false,
  updateEditRoastery: (state) => set({ editRoastery: state }),
  updateEditBeanTaste: (state) => set({ editBeanTaste: state }),

  // Add an item to the taste array (ensuring uniqueness)
  addBeanTaste: (item) =>
    set((state) => {
      if (state.taste.includes(item)) return state; // No duplicates
      return { taste: [...state.taste, item] };
    }),

  // Remove an item from the taste array
  removeBeanTaste: (item) =>
    set((state) => ({
      taste: state.taste.filter((t) => t !== item),
    })),

  // Clear the taste array
  clearBeanTaste: () => set({ taste: [] }),

  addBeanTasteFilter: (filterId: number) =>
    set((state) => ({ tasteFilter: [...state.tasteFilter, filterId] })),
  removeBeanTasteFilter: (filterId: number) =>
    set((state) => ({
      tasteFilter: state.tasteFilter.filter((id) => id !== filterId),
    })),
  clearBeanTasteFilter: () => set({ tasteFilter: [] }),
}));
