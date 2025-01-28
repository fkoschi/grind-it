import { Text, View, YStack } from "tamagui";
import { Image } from "expo-image";
import ThemedText from "../ui/Text/ThemedText";

const DashboardNoData = () => (
  <YStack flex={1} alignItems="center" paddingHorizontal="$8">
    <View mt="$6" mb="$6">
      <Image
        source={require("@/assets/images/coffe-bag.png")}
        contentFit="contain"
        style={{ flex: 0, height: 120, width: 120 }}
      />
    </View>
    <Text fontSize="$8" fontFamily="TBJSodabery-LightOriginal">
      Leider kein Treffer!
    </Text>
    <View py="$4" mt="$2">
      <ThemedText textAlign="center" fontSize={16} fw={400}>
        Für deine Suche konnte keine Bohne gefunden werden. Probier doch mal
        eine andere Suche.
      </ThemedText>
    </View>
  </YStack>
);

export default DashboardNoData;
