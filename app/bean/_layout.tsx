import { Slot, useNavigation, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Button, View, Text, YStack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import DeleteOutlinedIcon from "@/components/ui/Icons/DeleteOutlined";
import { useLocalSearchParams, useRouteInfo } from "expo-router/build/hooks";
import Alert from "@/components/ui/Alert/Alert";
import { beanTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import ThemedText from "@/components/ui/ThemedText";
import EditBean from "./EditBean";
import { PATH_NAME as EDIT_DEGREE_PATH_NAME } from "./edit/degree/[id]";
import { PATH_NAME as EDIT_BEAN_PATH_NAME } from "./edit/[id]";
import { PATH_NAME as DETAILS_BEAN_PATH_NAME } from "./details/[id]";
import { useDatabase } from "@/provider/DatabaseProvider";
import { ExpoSQLiteDatabase, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { HapticTab } from "@/components/HapticTab";
import HeartIcon from "@/components/ui/Icons/Heart";

const BeanDetailsLayout = () => {
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select()
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId)))
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

const BeanEditLayout = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select({ name: beanTable.name })
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId)))
  );

  const handleDeleteBeanPress = async () => {
    await db.delete(beanTable).where(eq(beanTable.id, Number(beanId)));
    router.replace("/");
  };

  const name = beanData?.[0]?.name;

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
        <Text fontSize={40}>{name}</Text>
      </View>
    </>
  );
};

const BeanAddLayout = () => (
  <View
    flex={1}
    position="absolute"
    bottom={24}
    alignItems="center"
    width="100%"
  >
    <Text fontSize="$8">Neue Bohne</Text>
    <ThemedText fw={400} mt="$2">
      Erstellen Sie eine neue Bohne.
    </ThemedText>
  </View>
);

const BeanEditDegreeLayout = () => (
  <View
    flex={0}
    position="absolute"
    bottom={40}
    alignItems="center"
    width="100%"
  >
    <YStack flex={0} alignItems="center">
      <Text fontSize="$10" fontFamily="BlackMango-Regular">
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
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();
  const { pathname: routerPathName } = useRouteInfo();
  const navigation = useNavigation();

  const { data: beanData } = useLiveQuery(
    db
      .select({ isFavorit: beanTable.isFavorit })
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId)))
  );

  const isEditBeanRoute = routerPathName === `${EDIT_BEAN_PATH_NAME}/${beanId}`;
  const isDetailsRoute =
    routerPathName === `${DETAILS_BEAN_PATH_NAME}/${beanId}`;
  const isEditDegreeRoute = routerPathName.includes(EDIT_DEGREE_PATH_NAME);
  const isAddRoute = routerPathName.includes("add");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const getHeaderHeight = () => {
    if (isAddRoute) {
      return "$14";
    }
    return "$18";
  };

  return (
    <EditBean>
      <View flex={1}>
        <LinearGradient
          height={getHeaderHeight()}
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
