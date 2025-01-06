import { FC } from "react";
import { CoffeeBean } from "@/types";
import { View, Text, YStack, styled, getFontSize } from "tamagui";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import ThemedText from "../ThemedText";
import { beanTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";

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
  const { db } = useDatabase();
  const { id, roastery, name, isFavorite, degreeOfGrinding = 0.0 } = data;

  const handlePress = async () => {
    await db
      .update(beanTable)
      .set({ isFavorit: !isFavorite })
      .where(eq(beanTable.id, Number(id)));
  };

  return (
    <StyledCard>
      <View flex={0} justifyContent="center">
        <Image
          source={require("@/assets/images/coffee-cup.png")}
          style={{ marginLeft: -24, width: 80, height: 80 }}
        />
      </View>
      <YStack ml="$4" justifyContent="center" flex={1}>
        <Pressable onPress={() => router.navigate(`/bean/details/${id}`)}>
          <Text
            c="$primary"
            fontSize={12}
            fontFamily="DarkerGrotesque_500Medium"
          >
            {roastery}
          </Text>
          <Text
            fontSize={28}
            fontFamily="TBJSodabery-LightOriginal"
            mt="$2"
          >
            {name}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.navigate(`/bean/edit/degree/${id}`)}>
          <View
            flex={1}
            alignItems="flex-start"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <ThemedText fw={300} fontSize={12} mt="$1">
              Mahlgrad
            </ThemedText>
            <Text
              mt="$1"
              c="$primary"
              fontSize={32}
              fontFamily="TBJSodabery-LightOriginal"
            >
              {degreeOfGrinding}
            </Text>
          </View>
        </Pressable>
      </YStack>
      <FavoriteButton isFavorite={isFavorite ?? false} onPress={handlePress} />
    </StyledCard>
  );
};
export default CoffeeCard;
