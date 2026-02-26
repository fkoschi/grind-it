import { useState } from "react";
import { XStack, Input, Button, View } from "tamagui";
import { Send } from "@tamagui/lucide-icons";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <View padding="$4" opacity={disabled ? 0.5 : 1} pointerEvents={disabled ? "none" : "auto"}>
      <XStack
        backgroundColor="rgba(255, 255, 255, 0.9)"
        borderRadius="$10" // Pill shape
        paddingHorizontal="$4"
        paddingVertical="$2"
        alignItems="center"
        gap="$2"
      >
        <Input
          flex={1}
          unstyled // Removes default styles to blend in
          size="$4"
          placeholder={t("chat.inputPlaceholder")}
          placeholderTextColor="$gray2"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          multiline
          color="$secondary"
          numberOfLines={1}
          maxHeight={120} // Limit height growth
        />

        <Button
          size="$3"
          circular
          icon={Send}
          backgroundColor="transparent"
          borderWidth={0}
          color={message.trim() ? "$primary" : "$gray3"}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
          hoverStyle={{ scale: 1.1 }}
          pressStyle={{ scale: 0.9 }}
          animation="quick"
        />
      </XStack>
    </View>
  );
};
