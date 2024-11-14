import { FC } from "react";
import { CoffeeCard as ICoffeeCard } from "@/types";
import { View, Text, YStack, styled } from "tamagui";
import { Image } from "expo-image";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

interface CoffeeCardProps {
  data: ICoffeeCard;
}

const StyledCard = styled(YStack, {
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
  const { id, roastHouse, name, degreeOfGrinding, isFavorit } = data;

  const imagePath =
    id % 2 === 1
      ? require("./img/coffee-cup.png")
      : require("./img/coffee-cup-v1.png");

  return (
    <StyledCard>
      <View flex={0} justifyContent="center">
        <Image
          source={imagePath}
          style={{ marginLeft: -40, width: 100, height: 100 }}
        />
      </View>
      <YStack ml="$4" justifyContent="center">
        <Pressable onPress={() => router.navigate("/details")}>
          <Text
            c="$primary"
            fontSize={16}
            fontFamily="DarkerGrotesque_500Medium"
          >
            {roastHouse}
          </Text>
          <Text fontSize={24} fontFamily="BlackMango-Regular">
            {name}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.navigate("/(edit)/degree")}>
          <Text fontSize={10} mt="$2">
            Mahlgrad
          </Text>
          <Text fontSize={48} c="$primary" fontFamily="BlackMango-Regular">
            {degreeOfGrinding}
          </Text>
        </Pressable>
      </YStack>
      <FavoriteButton isFavorite={isFavorit} />
    </StyledCard>
  );
};
export default CoffeeCard;
