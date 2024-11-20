import { FC } from "react";
import { CoffeeBean } from "@/types";
import { View, Text, YStack, styled } from "tamagui";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import ThemedText from "../ThemedText";

interface CoffeeCardProps {
  data: CoffeeBean;
}

const StyledCard = styled(YStack, {
  flex: 1,
  flexDirection: "row",
  backgroundColor: "white",
  width: "100%",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  elevation: 4,
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderRadius: "$8",
  p: "$2",
  mb: "$3",
});

const CoffeeCard: FC<CoffeeCardProps> = ({ data }) => {
  const router = useRouter();
  const { id, roastery, name, degreeOfGrinding, isFavorit } = data;

  const imagePath = require("@/assets/images/coffee-cup.png");

  return (
    <StyledCard>
      <View flex={0} justifyContent="center">
        <Image
          source={imagePath}
          style={{ marginLeft: -24, width: 80, height: 80 }}
        />
      </View>
      <YStack ml="$4" justifyContent="center" flex={1}>
        <Pressable onPress={() => router.navigate(`/bean/details/${id}`)}>
          <Text
            c="$primary"
            fontSize={16}
            fontFamily="DarkerGrotesque_500Medium"
          >
            {roastery}
          </Text>
          <Text fontSize={24} fontFamily="BlackMango-Regular">
            {name}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.navigate("/(edit)/degree")}>
          <View
            flex={1}
            alignItems="flex-start"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <ThemedText fw={300} fontSize={10} mt="$2">
              Mahlgrad
            </ThemedText>
            <Text
              fontSize="$9"
              lineHeight="$9"
              c="$primary"
              fontFamily="BlackMango-Regular"
            >
              {degreeOfGrinding}
            </Text>
          </View>
        </Pressable>
      </YStack>
      <FavoriteButton isFavorite={isFavorit ?? false} />
    </StyledCard>
  );
};
export default CoffeeCard;
