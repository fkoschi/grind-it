import { YStack, Text } from "tamagui";
import { Image } from "expo-image";

const DashboardEmpty = () => (
  <YStack flex={1} alignItems="center">
    <Image
      source={require("@/assets/images/no-data.png")}
      contentFit="contain"
      style={{ flex: 0, height: 400, width: "50%" }}
    />
    <Text fontSize="$8" fontFamily="BlackMango-Regular">
      Lass uns loslegen!
    </Text>
    <Text fontSize="$6" fontFamily="DarkerGrotesque_400Regular">
      Erstelle deine erste Bohne.
    </Text>
    <Image
      source={require("@/assets/icons/arrow-down.png")}
      style={{ flex: 0, height: 24, width: 24, marginTop: 16 }}
    />
  </YStack>
);

export default DashboardEmpty;