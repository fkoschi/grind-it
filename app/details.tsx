import { FC } from "react";
import { Pressable } from "react-native";
import { Text, View } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import { useRouter } from "expo-router";
import ThemedText from "@/components/ui/ThemedText";
import Badge from "@/components/ui/Badge/Badge";

const Details: FC = () => {
  const router = useRouter();

  const handleBackButtonPress = () => router.back();

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
        <Pressable
          style={{ position: "absolute", top: 80, left: 32 }}
          onPress={handleBackButtonPress}
        >
          <Image
            source={require("../assets/icons/back.png")}
            style={{ width: 24, height: 24 }}
          />
        </Pressable>
      </LinearGradient>
      <View flex={0}>
        <Image
          source={require("../assets/images/coffee-cup.png")}
          style={{
            position: "absolute",
            zIndex: 1,
            top: -140,
            right: -20,
            width: 200,
            height: 200,
          }}
        />
      </View>
      <View flex={1} p="$6">
        <ThemedText fontSize="$6" color="$primary" fw={500}>
          Supremo
        </ThemedText>
        <Text fontSize="$10" fontFamily="BlackMango-Regular">
          Toskana
        </Text>

        <View>
          <View>
            <ThemedText fw={800} mb="$2">
              Geschmack
            </ThemedText>
            <View
              flex={0}
              flexWrap="wrap"
              flexDirection="row"
              gap={4}
              rowGap={6}
            >
              <Badge title="schokig" />
              <Badge title="nussig" />
            </View>
          </View>
          <View mt="$4">
            <ThemedText fw={800} mb="$2">
              Mahlgrad
            </ThemedText>
            <Text
              fontSize="$16"
              lineHeight="$16"
              color="$primary"
              fontFamily="BlackMango-Regular"
            >
              7.1
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Details;
