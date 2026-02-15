import { ThemedText } from "@/components/ui";
import { View, Text } from "tamagui";
import { useTranslation } from "react-i18next";

export const BeanHeaderLayoutAdd = () => {
  const { t } = useTranslation();

  return (
    <View flex={1} position="absolute" bottom={24} alignItems="center" width="100%">
      <Text fontSize={32} fontFamily="$sodabery">
        {t("addBean.header.title")}
      </Text>
      <ThemedText fw={400} mt="$1">
        {t("addBean.header.subtitle")}
      </ThemedText>
    </View>
  );
};
