import { Badge, FilterChip, ThemedText } from "@/components/ui";
import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";
import { eq } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Input, View, XStack, Text, ScrollView, getFontSize } from "tamagui";
import {
  selectBeanTasteById,
  selectFilteredBeanTasteSuggestion,
} from "@/db/queries";
import { useAutoFocus } from "@/hooks/useAutoFocus";

interface BeanTasteForm {
  flavorName: string;
}

interface EditBeanTasteFrameProps {
  open: boolean;
}
const EditBeanTasteFrame: FC<EditBeanTasteFrameProps> = ({ open }) => {
  const { db } = useDatabase();
  const inputRef = useRef<Input>(null);
  const { id: beanId } = useLocalSearchParams();
  const [beanTasteData, setBeanTasteData] = useState<Taste[]>([]);
  const [beanSuggestionTasteData, setBeanSuggestionTasteData] = useState<
    Taste[]
  >([]);

  const { control, reset, handleSubmit } = useForm<BeanTasteForm>();
  const updateTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);

  const fetchBeanTasteData = useCallback(
    () => selectBeanTasteById(db, beanId).all(),
    [beanId, db],
  );

  const fetchBeanSuggestionTasteData = useCallback(
    (beanTasteFilter: number[]) =>
      selectFilteredBeanTasteSuggestion(db, beanTasteFilter).all(),
    [db],
  );

  const update = useCallback(() => {
    const beanTasteData = fetchBeanTasteData();
    setBeanTasteData(beanTasteData);

    const beanTasteFilter = beanTasteData.map((taste) => taste.id);
    const beanTasteSuggestionData =
      fetchBeanSuggestionTasteData(beanTasteFilter);
    setBeanSuggestionTasteData(beanTasteSuggestionData);
  }, [fetchBeanSuggestionTasteData, fetchBeanTasteData]);

  useEffect(() => {
    update();
  }, [update]);

  const handleRemovePress = async (tasteId: number | null) => {
    if (tasteId) {
      await db
        .delete(beanTasteAssociationTable)
        .where(eq(beanTasteAssociationTable.tasteId, tasteId));

      update();
    }
  };

  const handleSuggestionPress = async (tasteId: number) => {
    if (tasteId) {
      await db.insert(beanTasteAssociationTable).values({
        beanId: Number(beanId),
        tasteId,
      });

      update();
    }
  };

  const onSubmit = async (formData: BeanTasteForm) => {
    const flavorName = formData.flavorName.trim();
    const isFlavorStoredInDb = !!beanTasteData.find(
      (taste: Taste) => taste.flavor.toLowerCase() === flavorName.toLowerCase(),
    );

    if (isFlavorStoredInDb) {
      // TODO: show some error
      return;
    }

    const insertedTasteId = await db
      .insert(beanTasteTable)
      .values({ flavor: flavorName })
      .returning({ id: beanTasteTable.id });

    await db.insert(beanTasteAssociationTable).values({
      beanId: Number(beanId),
      tasteId: insertedTasteId[0].id,
    });

    reset();
    update();
  };

  useAutoFocus(inputRef, open);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View flex={1} bgC="$screenBackground">
        <ScrollView flex={1} padding="$4">
          <View>
            <ThemedText
              fw={500}
              mt={"$2"}
              color={"$primary"}
              fontSize={getFontSize("$8")}
              lineHeight={getFontSize("$8")}
            >
              Aktuelle Auswahl:
            </ThemedText>
            <XStack gap="$2" flexWrap="wrap" mt="$3">
              {!beanTasteData?.length && (
                <XStack flex={1} height="$8" justifyContent="center">
                  <Image
                    source={require("@/assets/images/latte-art.png")}
                    style={{ width: 80, height: 80 }}
                  />
                </XStack>
              )}
              {beanTasteData?.map(({ id: tasteId, flavor }, index) => (
                <Badge
                  key={index}
                  title={flavor ?? ""}
                  withButton
                  onPress={() => handleRemovePress(tasteId)}
                />
              ))}
            </XStack>
          </View>
          <View mt="$4">
            <ThemedText fw={500} fontSize="$6" lineHeight="$2">
              Vorschläge:
            </ThemedText>
            <XStack gap="$2" flexWrap="wrap" mt="$3">
              {beanSuggestionTasteData?.map(
                ({ id: tasteId, flavor }, index) => (
                  <FilterChip
                    key={index}
                    id={tasteId}
                    name={flavor ?? ""}
                    onPress={() => handleSuggestionPress(tasteId)}
                  />
                ),
              )}
            </XStack>
          </View>
        </ScrollView>
      </View>

      <XStack flex={0} py="$4" px="$4" bgC={"$white"}>
        <View flex={1} height={48} justifyContent="center">
          <Controller
            name="flavorName"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                ref={inputRef}
                returnKeyType="done"
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyLabel="Fertig"
                submitBehavior="submit"
              />
            )}
          />
        </View>
        <View flex={0} ml="$3" height={48} justifyContent="center">
          <Pressable
            onPress={() => updateTasteSheet({ showSheet: false, type: "edit" })}
          >
            <Text>Abbrechen</Text>
          </Pressable>
        </View>
      </XStack>
    </KeyboardAvoidingView>
  );
};
export default EditBeanTasteFrame;
