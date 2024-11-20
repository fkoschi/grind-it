import Header from "@/components/Header";
import Card from "@/components/ui/Card/Card";
import { FC, useEffect, useState } from "react";
import { View, Text, ScrollView, YStack } from "tamagui";
import { Image } from "expo-image";
import TabBar from "@/components/navigation/TabBar";
import { db } from "@/services/db-service";
import { beanTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

const HomePage: FC = () => {
  
  const { data: beansData} = useLiveQuery(db.select().from(beanTable));
  const noData = !beansData?.length;

  const Cards = () => {
    if (noData) {
      return (
        <YStack flex={1} alignItems="center">
          <Image
            source={require("@/assets/images/no-data.png")}
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
            source={require("@/assets/icons/arrow-down.png")}
            style={{ flex: 0, height: 24, width: 24, marginTop: 16 }}
          />
        </YStack>
      );
    }
    return (
      <ScrollView bgC="$screenBackground" flex={1} pl="$8" pt="$4" pr="$8">
        {beansData?.map((bean, i) => (
          <Card key={`dashboard-card-${i}`} data={bean} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View flex={1} bgC="$screenBackground">
      <Header disabled={noData} />
      <Cards />
      <TabBar />
    </View>
  );
};

export default HomePage;
