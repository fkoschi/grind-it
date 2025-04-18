import { HapticTab, HeartIcon } from "@/components/ui";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "tamagui";
import { useBackButtonTrigger } from "@/hooks/useBackButtonTrigger";
import { beanTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";

export const BeanHeaderLayoutDetails = ({
  isFavorite: defaultIsFavorite,
}: any) => {
  const { db } = useDatabase();
  const animationRef = useRef<LottieView>(null);
  const { id: beanId } = useLocalSearchParams();

  const [isFavorite, setIsFavorit] = useState<boolean>(defaultIsFavorite);
  const [prevIsFavorite, setPrevIsFavorite] = useState(isFavorite);

  useBackButtonTrigger(async () => {
    await db
      .update(beanTable)
      .set({ isFavorit: isFavorite })
      .where(eq(beanTable.id, Number(beanId)));
  });

  useEffect(() => {
    if (isFavorite && !prevIsFavorite) {
      animationRef.current?.play();

      setTimeout(() => {
        animationRef.current?.reset();
      }, 1300);
    }

    setPrevIsFavorite(isFavorite);
  }, [isFavorite, prevIsFavorite]);

  const handleFavoriteButtonPress = async (isFavorit: boolean) => {
    setIsFavorit(isFavorit);
  };

  return (
    <View flex={1}>
      <LottieView
        style={styles.lottieContainer}
        ref={animationRef}
        source={require("@/assets/animations/love.json")}
      />
      <View position="absolute" bottom={24} left={32}>
        <HapticTab onPress={() => handleFavoriteButtonPress(!isFavorite)}>
          <View
            flex={1}
            bgC={"rgba(255, 255, 255, 0.2)"}
            height={32}
            width={32}
            borderRadius={99}
            alignItems="center"
            justifyContent="center"
          >
            <HeartIcon
              size={16}
              fill={isFavorite ? "#CD5B5B" : "transparent"}
              strokeColor={isFavorite ? "transparent" : "#4a4a4a"}
            />
          </View>
        </HapticTab>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    width: 60,
    height: 60,
    position: "absolute",
    left: 18,
    bottom: 10,
  },
});
