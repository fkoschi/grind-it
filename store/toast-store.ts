import { create } from "zustand";
import { ToastProps } from "@/components/ui/Toast";

export interface ToastMessage extends ToastProps {
  id: string;
  duration?: number;
}

type State = {
  toasts: ToastMessage[];
};

type Action = {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  hideToast: (id: string) => void;
};

export const useToastStore = create<State & Action>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 3000);
    }
  },
  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
