import Header from "@/components/Header";
import Card from "@/components/ui/Card/Card";
import { dashboardListData } from "@/data/__mock__/list";
import { FC } from "react";
import { View, Text, ScrollView, YStack } from "tamagui";
import { Image } from "expo-image";

const Home: FC = () => {
  const mockedData = dashboardListData;
  const noData = !mockedData.length;

  const Cards = () => {
    if (noData) {
      return (
        <YStack flex={1} alignItems="center">
          <Image
            source={require("../assets/images/no-data.png")}
            contentFit="contain"
            style={{ flex: 0, height: 400, width: "50%" }}
          />
          <Text fontSize="$8" fontFamily="BlackMango-Regular">
            Lass uns loslegen!
          </Text>
          <Text fontSize="$6" fontFamily="DarkerGrotesque_400Regular">
            Erstelle deine erste Bohne.
          </Text>
          <Image
            source={require("../assets/icons/arrow-down.png")}
            style={{ flex: 0, height: 24, width: 24, marginTop: 16 }}
          />
        </YStack>
      );
    }
    return (
      <ScrollView bgC="#F7F7F7" pl="$8" pt="$4" pr="$8">
        {mockedData.map((card, i) => (
          <Card key={`dashboard-card-${i}`} data={card} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View flex={1} bgC="#F7F7F7">
      <Header disabled={noData} />
      <Cards />
    </View>
  );
};

export default Home;
