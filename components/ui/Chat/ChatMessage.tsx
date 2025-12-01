import { FC } from "react";
import { View, styled, XStack } from "tamagui";
import { ChatAvatar } from "./ChatAvatar";
import ThemedText from "../Text/ThemedText";

interface ChatMessageProps {
  message: string;
  type: "user" | "bot";
  avatarImage?: string;
}

const MessageBubble = styled(View, {
  paddingVertical: "$2",
  paddingHorizontal: "$3",
  borderRadius: 18, // Standard iMessage radius
  maxWidth: "75%",
  variants: {
    type: {
      user: {
        backgroundColor: "#007AFF", // iMessage Blue
        borderBottomRightRadius: 2, // Tail effect
        marginLeft: "auto", // Push to right
      },
      bot: {
        backgroundColor: "#E9E9EB", // iMessage Gray (Light mode default, adjust for dark if needed)
        // For dark mode it would be #262628
        borderBottomLeftRadius: 2, // Tail effect
        marginRight: "auto", // Push to left
      },
    },
  } as const,
});

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  type,
  avatarImage,
}) => {
  const isUser = type === "user";

  return (
    <XStack
      width="100%"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      gap="$2"
      mb="$1" // Tighter spacing like iMessage
    >
      {!isUser && <ChatAvatar type="bot" image={avatarImage} />}
      <MessageBubble type={type}>
        <ThemedText
          fw={400}
          color={isUser ? "white" : "black"} // Adjust text color based on background
          fontSize={16}
          lineHeight={20}
        >
          {message}
        </ThemedText>
      </MessageBubble>
      {/* User avatar is typically not shown in iMessage, but keeping it if desired or removing it for strict adherence. 
          The user asked for "avatar for the user" previously, but "styling as in apple messages" now. 
          I will hide the user avatar to match iMessage strictly, or maybe just keep it small? 
          Let's keep it for now as per previous request, but maybe the user wants it gone? 
          I'll comment it out or keep it. The prompt said "styling of the messages", not "remove avatar". 
          I'll keep it but maybe make it look better. */}
      {isUser && <ChatAvatar type="user" image={avatarImage} />}
    </XStack>
  );
};
