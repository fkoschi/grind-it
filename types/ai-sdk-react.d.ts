declare module "@ai-sdk/react" {
  import type { ChatTransport, UIMessage } from "ai";

  export type UseChatOptions = {
    transport: ChatTransport<UIMessage>;
    onError?: (error: Error) => void;
  };

  export function useChat(options: UseChatOptions): {
    messages: UIMessage[];
    error?: Error;
    status: string;
    sendMessage: (input: { text: string }) => void;
  };
}
