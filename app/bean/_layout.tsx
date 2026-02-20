import { Slot, useLocalSearchParams, useNavigation } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { View } from "tamagui";
import React, { useCallback, useEffect } from "react";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import EditBean from "./EditBean";
import BeanHeaderLayout from "@/components/BeanHeaderLayout/BeanHeaderLayout";
import { useDatabase } from "@/provider/DatabaseProvider";
import { beanTable } from "@/db/schema";

const BeanLayout = () => {
  const navigation = useNavigation();
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select({ roastery: beanTable.roastery })
      .from(beanTable)
      .where(eq(beanTable.id, Number(beanId) || 0)),
    [beanId],
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleRoasterySelect = useCallback(
    async (roasteryId: number) => {
      if (!beanId) return;
      await db
        .update(beanTable)
        .set({ roastery: roasteryId })
        .where(eq(beanTable.id, Number(beanId)));
    },
    [db, beanId],
  );

  const selectedRoasteryId = beanData?.[0]?.roastery ?? undefined;

  return (
    <EditBean
      selectedRoasteryId={selectedRoasteryId}
      onRoasterySelect={beanId ? handleRoasterySelect : undefined}
      onRoasteryCreated={beanId ? handleRoasterySelect : undefined}
    >
      <View flex={1}>
        <BeanHeaderLayout />
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
