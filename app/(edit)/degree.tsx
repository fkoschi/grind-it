import { useRouter } from "expo-router";
import { FC, useState } from "react";
import { Pressable } from "react-native";
import { Circle, Slider, Text, View, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import ThemedText from "@/components/ui/ThemedText";

/**
 * Edit the degree of grinding for the Bean
 */
const EditDegree: FC = () => {
  const router = useRouter();
  const [degreeValue, setDegreeValue] = useState<number[]>([5]);

  const handleValueChange = (value: number[]) => {
    console.log(value);
    setDegreeValue(value);
  };

  return (
    <View flex={1}>
      <LinearGradient
        height="$20"
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
      >
        <XStack flex={1} mt="$10" justifyContent="space-between" mx="$4">
          <Pressable onPress={() => router.dismiss()}>
            <View height={32} p="$2">
              <Image
                source={require("../../assets/icons/back.png")}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </Pressable>

          <Pressable onPress={() => router.dismiss()}>
            <View
              flex={0}
              width={32}
              height={32}
              alignItems="center"
              bgC="$primaryGreen"
              borderRadius="$16"
              p="$2"
              mr="$2"
            >
              <Image
                source={require("../../assets/icons/check.png")}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </Pressable>
        </XStack>

        <YStack flex={0} alignItems="center" mb="$6">
          <Text fontSize="$10" fontFamily="BlackMango-Regular">
            Toskana
          </Text>
          <ThemedText fontSize="$5" fw={500}>
            Mahlgrad anpassen
          </ThemedText>
        </YStack>
      </LinearGradient>

      <View flex={0} alignItems="center" mt="$10">
        <Text fontSize="$14" color="$primary" fontFamily="BlackMango-Regular">
          {degreeValue[0]}
        </Text>
      </View>

      <View flex={1} alignItems="center" overflow="hidden" mt="$12">
        <Circle flex={1} justifyContent="flex-start" size={600} bgC="#E8E8E8">
          <Slider
            size="$2"
            width="$16"
            height="$8"
            defaultValue={degreeValue}
            max={10}
            step={0.1}
            mt="$11"
            onValueChange={handleValueChange}
          >
            <Slider.Track>
              <Slider.TrackActive backgroundColor="$primary" />
            </Slider.Track>
            <Slider.Thumb
              circular
              backgroundColor="$primary"
              borderColor="white"
              index={0}
            />
          </Slider>
        </Circle>
      </View>
    </View>
  );
};
export default EditDegree;
