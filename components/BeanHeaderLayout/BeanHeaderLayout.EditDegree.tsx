import { ThemedText } from "@/components/ui";
import { Text, View, YStack } from "tamagui";
import { useTranslation } from "react-i18next";

export const BeanHeaderLayoutEditDegree = () => {
  const { t } = useTranslation();

  return (
    <View flex={0} position="absolute" bottom={40} alignItems="center" width="100%">
      <YStack flex={0} alignItems="center">
        <Text fontSize="$10" fontFamily="$sodabery">
          Toskana
        </Text>
        <ThemedText fontSize="$5" fw={500}>
          {t("editBean.editDegree.subtitle")}
        </ThemedText>
      </YStack>
    </View>
  );
};
