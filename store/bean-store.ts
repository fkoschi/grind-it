import { Taste } from "@/types";
import { create } from "zustand";

type State = {
  // Intermediate state for creating a new Bean. Once the Bean is created, the list of tastes is going to be stored into the DB.
  taste: Array<Taste>;
  // Used on Dashboard to filter for certain taste types
  tasteFilter: Array<number>;
  // Used to handle the BottomSheet
  editRoastery: boolean;
  // Used to handle the BottomSheet
  editBeanTaste: { showSheet: boolean; type: "edit" | "add" };
};
type Action = {
  updateEditRoastery: (state: State["editRoastery"]) => void;
  updateEditBeanTaste: (state: State["editBeanTaste"]) => void;

  // Bean Taste
  addBeanTaste: (taste: Taste) => void;
  removeBeanTaste: (taste: Taste) => void;
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
  editBeanTaste: { showSheet: false, type: "add" },
  updateEditRoastery: (state) => set({ editRoastery: state }),
  updateEditBeanTaste: (state) => set({ editBeanTaste: state }),

  // Add an item to the taste array (ensuring uniqueness)
  addBeanTaste: (item) =>
    set((state) => {
      if (state.taste.includes(item)) return state;
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
