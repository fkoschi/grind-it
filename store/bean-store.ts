import { create } from "zustand";

type State = {
  editRoastery: boolean;
};
type Action = {
  updateEditRoastery: (state: State["editRoastery"]) => void;
};
export const useBeanStore = create<State & Action>((set) => ({
  editRoastery: false,
  updateEditRoastery: (state) => set({ editRoastery: state }),
}));
