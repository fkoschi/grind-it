import type { UIMessage } from "ai";
import { create } from "zustand";

type ChatState = {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));
