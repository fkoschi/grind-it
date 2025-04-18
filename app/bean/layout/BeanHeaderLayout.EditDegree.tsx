import { ThemedText } from "@/components/ui";
import { Text, View, YStack } from "tamagui";

export const BeanHeaderLayoutEditDegree = () => (
  <View
    flex={0}
    position="absolute"
    bottom={40}
    alignItems="center"
    width="100%"
  >
    <YStack flex={0} alignItems="center">
      <Text fontSize="$10" fontFamily="TBJSodabery-LightOriginal">
        Toskana
      </Text>
      <ThemedText fontSize="$5" fw={500}>
        Mahlgrad anpassen
      </ThemedText>
    </YStack>
  </View>
);
