import { Slot, useNavigation, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Button, View, Text, YStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import React, { FC, useEffect } from "react";
import { useLocalSearchParams, useRouteInfo } from "expo-router/build/hooks";
import { beanTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ThemedText, Alert } from "@/components/ui";
import { HeartIcon, DeleteOutlinedIcon } from "@/components/ui/Icons";
import { PATH_NAME as EDIT_DEGREE_PATH_NAME } from "./edit/degree/[id]";
import { PATH_NAME as EDIT_BEAN_PATH_NAME } from "./edit/[id]";
import { PATH_NAME as DETAILS_BEAN_PATH_NAME } from "./details/[id]";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { HapticTab } from "@/components/ui/HapticTab/HapticTab";
import Animated, { withSpring } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import { useKeyboardIsVisible } from "@/hooks/useKeyboardIsVisible";
import { useIsBottomSheetActive } from "@/hooks/useIsBottomSheetActive";

import EditBean from "./EditBean";

const BeanDetailsLayout = () => {
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select()
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId))),
  );

  const handleFavoriteButtonPress = async (isFavorit: boolean) => {
    await db
      .update(beanTable)
      .set({ isFavorit })
      .where(eq(beanTable.id, Number(beanId)));
  };

  const isFavorit = !!beanData?.[0]?.isFavorit;

  return (
    <View position="absolute" bottom={24} left={32}>
      <HapticTab onPress={() => handleFavoriteButtonPress(!isFavorit)}>
        <View
          flex={1}
          bgC={"white"}
          height={32}
          width={32}
          borderRadius={99}
          alignItems="center"
          justifyContent="center"
        >
          <HeartIcon
            size={16}
            fill={isFavorit ? "#CD5B5B" : "transparent"}
            strokeColor={isFavorit ? "transparent" : "#4a4a4a"}
          />
        </View>
      </HapticTab>
    </View>
  );
};

const BeanEditLayout: FC = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();
  const fontSize = useSharedValue(48);

  const { data: beanData } = useLiveQuery(
    db
      .select({ name: beanTable.name })
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId))),
  );

  const handleDeleteBeanPress = async () => {
    await db.delete(beanTable).where(eq(beanTable.id, Number(beanId)));
    router.replace("/");
  };

  const name = beanData?.[0]?.name;

  const isKeyboardVisible = useKeyboardIsVisible();
  const isBottomSheetActive = useIsBottomSheetActive();

  useEffect(() => {
    if (isKeyboardVisible && !isBottomSheetActive) {
      fontSize.value = withSpring(24, { damping: 20, stiffness: 90 });
    } else {
      fontSize.value = withSpring(48, { damping: 20, stiffness: 90 });
    }
  }, [isKeyboardVisible, fontSize, isBottomSheetActive]);

  return (
    <>
      <View position="absolute" right={32} top={72}>
        <Alert
          title="Bohne löschen"
          cancelTitle="Abbrechen"
          actionTitle="Löschen"
          description="Soll die Bohne endgültig gelöscht werden?"
          onActionPress={handleDeleteBeanPress}
          alertTrigger={
            <Button
              flex={1}
              bgC={"rgba(255, 255, 255, 0.2)"}
              borderRadius="$radius.9"
              p="$3"
            >
              <DeleteOutlinedIcon size={16} color="#CD5B5B" />
            </Button>
          }
        />
      </View>
      <View flex={1} justifyContent="flex-end" alignItems="center" mb="$6">
        <Animated.Text
          style={{ fontSize, fontFamily: "TBJSodabery-LightOriginal" }}
        >
          {name}
        </Animated.Text>
      </View>
    </>
  );
};

const BeanAddLayout = () => {
  const fontSize = useSharedValue(32);
  const isKeyboardVisible = useKeyboardIsVisible();
  const isBottomSheetActive = useIsBottomSheetActive();

  useEffect(() => {
    if (isKeyboardVisible && !isBottomSheetActive) {
      fontSize.value = withSpring(24, { damping: 20, stiffness: 90 });
    } else {
      fontSize.value = withSpring(32, { damping: 20, stiffness: 90 });
    }
  }, [isKeyboardVisible, fontSize, isBottomSheetActive]);

  return (
    <View
      flex={1}
      position="absolute"
      bottom={24}
      alignItems="center"
      width="100%"
    >
      <Animated.Text
        style={{ fontSize, fontFamily: "TBJSodabery-LightOriginal" }}
      >
        Neue Bohne
      </Animated.Text>
      <ThemedText fw={400} mt="$1">
        Erstellen Sie eine neue Bohne.
      </ThemedText>
    </View>
  );
};

const BeanEditDegreeLayout = () => (
  <View
    flex={0}
    position="absolute"
    bottom={40}
    alignItems="center"
    width="100%"
  >
    <YStack flex={0} alignItems="center">
      <Text fontSize="$10" fontFamily="TBJSodabery-LightOriginal">
        Toskana
      </Text>
      <ThemedText fontSize="$5" fw={500}>
        Mahlgrad anpassen
      </ThemedText>
    </YStack>
  </View>
);

const BeanLayout = () => {
  const router = useRouter();
  const { id: beanId } = useLocalSearchParams();
  const { pathname: routerPathName } = useRouteInfo();
  const navigation = useNavigation();

  const isEditBeanRoute = routerPathName === `${EDIT_BEAN_PATH_NAME}/${beanId}`;
  const isDetailsRoute =
    routerPathName === `${DETAILS_BEAN_PATH_NAME}/${beanId}`;
  const isEditDegreeRoute = routerPathName.includes(EDIT_DEGREE_PATH_NAME);
  const isAddRoute = routerPathName.includes("add");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const height = useSharedValue(240);
  const isKeyboardVisible = useKeyboardIsVisible();
  const isBottomSheetActive = useIsBottomSheetActive();

  useEffect(() => {
    if (isKeyboardVisible && !isBottomSheetActive) {
      height.value = withSpring(140, { damping: 20, stiffness: 90 });
    } else {
      height.value = withSpring(260, { damping: 20, stiffness: 90 });
    }
  }, [isKeyboardVisible, height, isBottomSheetActive]);

  return (
    <EditBean>
      <View flex={1}>
        <Animated.View style={{ height, flex: 0 }}>
          <LinearGradient
            flex={1}
            colors={["#FFDAAB", "#E89E3F"]}
            borderBottomLeftRadius="$12"
            borderBottomRightRadius="$12"
            start={[0, 1]}
            end={[0, 0]}
          >
            <Pressable
              style={{ position: "sticky", top: 80, left: 32 }}
              onPress={() => router.back()}
            >
              <Image
                source={require("@/assets/icons/back.png")}
                style={{ width: 24, height: 24 }}
              />
            </Pressable>
            {isDetailsRoute && <BeanDetailsLayout />}
            {isEditDegreeRoute && <BeanEditDegreeLayout />}
            {isAddRoute && <BeanAddLayout />}
            {isEditBeanRoute && <BeanEditLayout />}
          </LinearGradient>
        </Animated.View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={16}
        >
          <Slot />
        </KeyboardAvoidingView>
      </View>
    </EditBean>
  );
};

export default BeanLayout;
