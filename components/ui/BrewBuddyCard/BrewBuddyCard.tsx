import { FC } from "react";
import { Pressable } from "react-native";
import { XStack, YStack, View, styled } from "tamagui";
import { MessageCircle } from "@tamagui/lucide-icons";
import ThemedText from "../Text/ThemedText";
import { useTranslation } from "react-i18next";

interface BrewBuddyCardProps {
  onPress: () => void;
}

const StyledCard = styled(XStack, {
  backgroundColor: "white",
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderRadius: "$8",
  p: "$4",
  alignItems: "center",
  gap: "$4",
});

const IconCircle = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "$primary",
  opacity: 0.15,
  position: "absolute",
});

const BrewBuddyCard: FC<BrewBuddyCardProps> = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <StyledCard>
        <View width={48} height={48} alignItems="center" justifyContent="center">
          <IconCircle />
          <MessageCircle size={24} color="$primary" />
        </View>
        <YStack flex={1}>
          <ThemedText fw={700} fontSize={18}>
            {t("settings.chat")}
          </ThemedText>
          <ThemedText fw={400} fontSize={14} color="$secondary">
            {t("chat.card.description")}
          </ThemedText>
        </YStack>
      </StyledCard>
    </Pressable>
  );
};

export default BrewBuddyCard;
