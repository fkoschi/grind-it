import { getFontSize, Text, View, YStack } from "tamagui";
import { Image } from "expo-image";

const DashboardNoData = () => (
  <YStack flex={1} alignItems="center">
    <View mt="$6" mb="$6">
      <Image
        source={require("@/assets/images/coffe-bag.png")}
        contentFit="contain"
        style={{ flex: 0, height: 120, width: 120 }}
      />
    </View>
    <Text fontSize="$8" fontFamily="BlackMango-Regular">
      Kein Treffer!
    </Text>
    <View py="$4">
      <Text
        textAlign="center"
        fontSize="$6"
        fontFamily="DarkerGrotesque_400Regular"
      >
        Für deine Suche konnte keine Bohne gefunden werden.
      </Text>
    </View>
  </YStack>
);

export default DashboardNoData;
