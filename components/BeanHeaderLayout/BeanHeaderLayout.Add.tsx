import { ThemedText } from "@/components/ui";
import { View, Text } from "tamagui";

export const BeanHeaderLayoutAdd = () => {
  return (
    <View flex={1} position="absolute" bottom={24} alignItems="center" width="100%">
      <Text fontSize={32} fontFamily="$sodabery">
        Neue Bohne
      </Text>
      <ThemedText fw={400} mt="$1">
        Erstellen Sie eine neue Bohne.
      </ThemedText>
    </View>
  );
};
