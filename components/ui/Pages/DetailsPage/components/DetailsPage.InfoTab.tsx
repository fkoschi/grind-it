import { FC } from "react";
import { View, Text, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { Badge, ThemedText } from "@/components/ui";
import { Pressable } from "react-native";
import { CoffeeBean } from "@/types";

interface Props {
  beansData: CoffeeBean;
  tastes: { flavor: string }[];
  onDegreePress: () => void;
}

export const DetailsPageInfoTab: FC<Props> = ({
  beansData,
  tastes,
  onDegreePress,
}) => (
  <YStack mt="$4">
    <ThemedText fontSize="$6" color="$primary" fw={500}>
      {beansData.roastery}
    </ThemedText>
    <Text fontSize="$11" mt="$2" fontFamily="TBJSodabery-LightOriginal">
      {beansData.name}
    </Text>

    <XStack flexDirection="row" mt="$2" justifyContent="space-between">
      <YStack flex={1}>
        <ThemedText fontSize="$8" fw={600}>
          {beansData.arabicaAmount}%
        </ThemedText>
        <Text fontSize="$2">Arabica</Text>
      </YStack>
      {beansData.arabicaAmount !== 100 && (
        <YStack flex={1}>
          <ThemedText fontSize="$8" fw={600}>
            {beansData.robustaAmount}%
          </ThemedText>
          <Text fontSize="$2">Robusta</Text>
        </YStack>
      )}
    </XStack>

    <XStack flexDirection="row" mt="$2" justifyContent="space-between">
      <YStack flex={1}>
        <ThemedText fontSize="$8" fw={600}>
          {beansData.singleShotDosis}g
        </ThemedText>
        <Text fontSize="$2">Single Shot</Text>
      </YStack>
      <YStack flex={1}>
        <ThemedText fontSize="$8" fw={600}>
          {beansData.doubleShotDosis}g
        </ThemedText>
        <Text fontSize="$2">Double Shot</Text>
      </YStack>
    </XStack>

    <YStack mt="$4">
      <YStack>
        <ThemedText fw={800} mb="$2">
          Geschmack
        </ThemedText>
        <View flexWrap="wrap" flexDirection="row" gap={4} rowGap={6}>
          {tastes.map((taste, index) => (
            <Badge key={`bean-details-flavor-${index}`} title={taste.flavor} />
          ))}
        </View>
      </YStack>
      <View mt="$4">
        <ThemedText fw={800} mb="$2">
          Mahlgrad
        </ThemedText>
        <Pressable onPress={onDegreePress}>
          <Text
            fontSize="$16"
            lineHeight="$16"
            color="$primary"
            fontFamily="TBJSodabery-LightOriginal"
          >
            {beansData.degreeOfGrinding ?? 0}
          </Text>
        </Pressable>
      </View>
    </YStack>
  </YStack>
);
