import type { UIMessage } from "ai";
import { Platform } from "react-native";

export const getOnDeviceUnavailableReason = (): "android" | "ios" | null => {
  if (Platform.OS !== "ios") return "android";
  return null;
};

export const getChatErrorMessage = (error: Error, t: (key: string) => string): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("context window") || msg.includes("exceededcontextwindowsize")) {
    return t("chat.error.contextWindow");
  }
  return t("chat.error.generic");
};

const getTextFromUiMessage = (message: UIMessage): string => {
  const candidate = message as UIMessage & {
    content?: string;
    parts?: Array<{ type?: string; text?: string }>;
  };

  if (typeof candidate.content === "string" && candidate.content.trim().length > 0) {
    return candidate.content;
  }

  if (!Array.isArray(candidate.parts)) return "";

  const textParts = candidate.parts
    .map((part) => {
      const value = part as { type?: string; text?: unknown };
      if (value.type !== "text" || typeof value.text !== "string") return null;
      return value.text.trim();
    })
    .filter(Boolean);

  return textParts.length > 0 ? textParts.join("\n") : "";
};

export const extractLatestUserQuery = (messages: UIMessage[]): string | null => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i] as UIMessage & { role?: string };
    if (message.role !== "user") continue;

    const text = getTextFromUiMessage(message);
    if (text.length > 0) return text;
  }

  return null;
};

export const truncate = (value: string, maxChars: number): string =>
  value.length <= maxChars ? value : `${value.slice(0, maxChars)}...`;
