import { Text, View, YStack } from "tamagui";
import { Image } from "expo-image";
import ThemedText from "../ui/Text/ThemedText";
import { useTranslation } from "react-i18next";

const DashboardNoData = () => {
  const { t } = useTranslation();

  return (
    <YStack flex={1} alignItems="center" paddingHorizontal="$8">
      <View mt="$6" mb="$6">
        <Image
          source={require("@/assets/images/coffe-bag.png")}
          contentFit="contain"
          style={{ flex: 0, height: 120, width: 120 }}
        />
      </View>
      <Text fontSize="$8" fontFamily="$sodabery">
        {t("dashboard.searchNoResult.title")}
      </Text>
      <View py="$4" mt="$2">
        <ThemedText textAlign="center" fontSize={16} fw={400}>
          {t("dashboard.searchNoResult.subtitle")}
        </ThemedText>
      </View>
    </YStack>
  );
};

export default DashboardNoData;
