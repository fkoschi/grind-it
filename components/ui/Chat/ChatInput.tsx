import { FC, useState } from "react";
import { View, Input, Button, XStack } from "tamagui";
import { Send } from "@tamagui/lucide-icons";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export const ChatInput: FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <XStack
      p="$3"
      gap="$2"
      alignItems="center"
      bgC="$backgroundStrong"
      borderTopWidth={1}
      borderColor="$borderColor"
    >
      <Input
        flex={1}
        value={text}
        onChangeText={setText}
        placeholder="Frag mich etwas..."
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={0}
      />
      <Button
        circular
        size="$3"
        backgroundColor="$primary"
        onPress={handleSend}
        disabled={!text.trim()}
        opacity={!text.trim() ? 0.5 : 1}
        pressStyle={{ backgroundColor: "$primaryHover" }}
      >
        <Send size={18} color="white" />
      </Button>
    </XStack>
  );
};
