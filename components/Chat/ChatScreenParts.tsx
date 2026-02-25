import { FC } from "react";
import { Image } from "react-native";
import { Button, Text, YStack } from "tamagui";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "@tamagui/lucide-icons";
import Markdown from "react-native-markdown-display";
import { Chat } from "@/components/Chat";
import type { UIMessage } from "ai";

const EMPTY_STATE_MARKDOWN_STYLE = {
  body: {
    color: "#664F3F",
    fontSize: 15,
    lineHeight: 22,
  },
  paragraph: {
    marginVertical: 0,
    fontSize: 15,
    lineHeight: 22,
  },
} as const;

const MESSAGE_MARKDOWN_STYLE = {
  body: {
    color: "#4A3728",
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#3A2A1C",
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#3A2A1C",
  },
  heading3: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 3,
    color: "#3A2A1C",
  },
  strong: {
    fontWeight: "bold",
    color: "#3A2A1C",
  },
  em: {
    fontStyle: "italic",
    color: "#4A3728",
  },
  list_item: {
    marginVertical: 2,
    flexDirection: "row",
  },
  bullet_list: {
    marginVertical: 4,
  },
  ordered_list: {
    marginVertical: 4,
  },
  paragraph: {
    marginVertical: 4,
    fontSize: 15,
    lineHeight: 22,
  },
  code_inline: {
    backgroundColor: "rgba(102, 79, 63, 0.08)",
    color: "#4A3728",
    fontFamily: "monospace",
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  code_block: {
    backgroundColor: "rgba(102, 79, 63, 0.08)",
    color: "#4A3728",
    fontFamily: "monospace",
    fontSize: 14,
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  fence: {
    backgroundColor: "rgba(102, 79, 63, 0.08)",
    color: "#4A3728",
    fontFamily: "monospace",
    fontSize: 14,
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  blockquote: {
    backgroundColor: "rgba(102, 79, 63, 0.05)",
    borderLeftColor: "#C4853A",
    borderLeftWidth: 3,
    marginLeft: 0,
    paddingLeft: 10,
    paddingVertical: 4,
    marginVertical: 4,
  },
  link: {
    color: "#C4853A",
    textDecorationLine: "underline",
  },
} as const;

interface ChatHeaderProps {
  onClose: () => void;
  onOpenConfig: () => void;
  onReset?: () => void;
  hasMessages?: boolean;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  onClose,
  onOpenConfig,
  onReset,
  hasMessages,
}) => (
  <YStack
    paddingHorizontal="$4"
    paddingTop="$3"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
  >
    <Image
      source={require("@/assets/images/icon.png")}
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
    <YStack flexDirection="row" gap="$2" alignItems="center">
      {hasMessages && onReset && (
        <Button
          size="$3"
          circular
          icon={RotateCcw}
          onPress={onReset}
          backgroundColor="transparent"
        />
      )}
      <Button
        size="$3"
        circular
        icon={SlidersHorizontal}
        onPress={onOpenConfig}
        backgroundColor="transparent"
      />
      <Button
        size="$3"
        circular
        icon={ChevronDown}
        onPress={onClose}
        backgroundColor="transparent"
      />
    </YStack>
  </YStack>
);

interface ChatEmptyStateProps {
  message: string;
}

export const ChatEmptyState: FC<ChatEmptyStateProps> = ({ message }) => (
  <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" paddingBottom="$8">
    <Image
      source={require("@/assets/images/no-data.png")}
      style={{ width: 200, height: 200 }}
      resizeMode="contain"
    />
    <Chat.Message alignment="left">
      <Markdown style={EMPTY_STATE_MARKDOWN_STYLE}>{message}</Markdown>
    </Chat.Message>
  </YStack>
);

interface ChatUnavailableBannerProps {
  message: string;
}

export const ChatUnavailableBanner: FC<ChatUnavailableBannerProps> = ({ message }) => (
  <YStack
    backgroundColor="rgba(255, 255, 255, 0.7)"
    borderRadius="$4"
    padding="$4"
    marginHorizontal="$2"
    marginBottom="$3"
  >
    <Text color="$secondary" fontSize="$3" lineHeight="$3">
      {message}
    </Text>
  </YStack>
);

interface ChatMessageListProps {
  messages: UIMessage[];
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ messages }) => (
  <Chat.Root>
    {messages.map((msg) => {
      const isUser = msg.role === "user";
      const text = msg.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");

      return (
        <Chat.Message key={msg.id} alignment={isUser ? "right" : "left"}>
          {isUser ? (
            <Chat.Bubble variant="primary">{text}</Chat.Bubble>
          ) : (
            <Markdown style={MESSAGE_MARKDOWN_STYLE}>{text}</Markdown>
          )}
        </Chat.Message>
      );
    })}
  </Chat.Root>
);

interface ChatErrorBannerProps {
  message: string;
}

export const ChatErrorBanner: FC<ChatErrorBannerProps> = ({ message }) => (
  <YStack
    paddingHorizontal="$4"
    paddingVertical="$3"
    backgroundColor="$red2"
    borderTopWidth={1}
    borderTopColor="$red6"
  >
    <Text color="$red10" fontSize="$3" lineHeight="$3">
      {message}
    </Text>
  </YStack>
);
