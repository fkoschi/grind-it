import { YStack } from "tamagui";
import { useMemo } from "react";
import Markdown from "react-native-markdown-display";

interface ChatBubbleProps {
  children: string;
  variant?: "primary" | "secondary";
}

export const ChatBubble = ({
  children,
  variant = "secondary",
}: ChatBubbleProps) => {
  const isPrimary = variant === "primary";

  const markdownStyles = useMemo(
    () => ({
      body: {
        color: isPrimary ? "#ffffff" : "#000000",
        fontSize: 14,
        lineHeight: 20,
      },
      link: {
        color: isPrimary ? "#87CEEB" : "#0066cc",
      },
      code_inline: {
        backgroundColor: isPrimary
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0.05)",
        color: isPrimary ? "#ffffff" : "#000000",
        fontFamily: "monospace",
        fontSize: 13,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
      },
      code_block: {
        backgroundColor: isPrimary
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0.05)",
        color: isPrimary ? "#ffffff" : "#000000",
        fontFamily: "monospace",
        fontSize: 13,
        padding: 8,
        borderRadius: 4,
      },
      fence: {
        backgroundColor: isPrimary
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0.05)",
        color: isPrimary ? "#ffffff" : "#000000",
        fontFamily: "monospace",
        fontSize: 13,
        padding: 8,
        borderRadius: 4,
      },
      blockquote: {
        backgroundColor: isPrimary
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(0, 0, 0, 0.03)",
        borderLeftColor: isPrimary
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(0, 0, 0, 0.2)",
        borderLeftWidth: 3,
        marginLeft: 0,
        paddingLeft: 10,
        paddingVertical: 4,
      },
      strong: {
        fontWeight: "bold" as const,
        color: isPrimary ? "#ffffff" : "#000000",
      },
      em: {
        fontStyle: "italic" as const,
        color: isPrimary ? "#ffffff" : "#000000",
      },
    }),
    [isPrimary],
  );

  return (
    <YStack
      backgroundColor={isPrimary ? "$primary" : "$gray4"}
      paddingVertical="$1"
      paddingHorizontal="$3"
      borderRadius="$4"
      borderBottomRightRadius={isPrimary ? 0 : "$4"}
      borderBottomLeftRadius={isPrimary ? "$4" : 0}
    >
      <Markdown style={markdownStyles}>{children}</Markdown>
    </YStack>
  );
};
