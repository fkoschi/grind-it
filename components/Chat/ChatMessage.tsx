import { XStack } from "tamagui";
import { ReactNode } from "react";

interface ChatMessageProps {
  children: ReactNode;
  alignment?: "left" | "right";
}

export const ChatMessage = ({
  children,
  alignment = "left",
}: ChatMessageProps) => {
  const isRight = alignment === "right";

  return (
    <XStack
      gap="$3"
      width="100%"
      flexDirection={isRight ? "row-reverse" : "row"}
      alignItems="flex-end"
      marginBottom="$3"
    >
      {children}
    </XStack>
  );
};
