import { Badge, FilterChip, ThemedText } from "@/components/ui";
import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";
import { useDuplicateCheck } from "@/hooks/useDuplicateCheck";
import { eq } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { getFontSize, Input, ScrollView, Text, View, XStack } from "tamagui";
import { selectBeanTasteById, selectFilteredBeanTasteSuggestion } from "@/db/queries";
import { useAutoFocus } from "@/hooks/useAutoFocus";
import { useTranslation } from "react-i18next";

interface BeanTasteForm {
  flavorName: string;
}

interface EditBeanTasteFrameProps {
  open: boolean;
}
const EditBeanTasteFrame: FC<EditBeanTasteFrameProps> = ({ open }) => {
  const { t } = useTranslation();
  const { db } = useDatabase();
  const inputRef = useRef<Input>(null);
  const { id: beanId } = useLocalSearchParams();
  const [beanTasteData, setBeanTasteData] = useState<Taste[]>([]);
  const [beanSuggestionTasteData, setBeanSuggestionTasteData] = useState<Taste[]>([]);
  const { duplicateError, checkInput, clearError } = useDuplicateCheck({
    table: beanTasteTable,
    fieldName: "flavor",
  });

  const { control, reset, handleSubmit } = useForm<BeanTasteForm>();
  const updateTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);

  const fetchBeanTasteData = useCallback(() => selectBeanTasteById(db, beanId).all(), [beanId, db]);

  const fetchBeanSuggestionTasteData = useCallback(
    (beanTasteFilter: number[]) => selectFilteredBeanTasteSuggestion(db, beanTasteFilter).all(),
    [db],
  );

  const update = useCallback(() => {
    const beanTasteData = fetchBeanTasteData();
    setBeanTasteData(beanTasteData);

    const beanTasteFilter = beanTasteData.map((taste) => taste.id);
    const beanTasteSuggestionData = fetchBeanSuggestionTasteData(beanTasteFilter);
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
    if (duplicateError) {
      return;
    }

    const flavorName = formData.flavorName.trim();
    if (!flavorName) {
      return;
    }

    try {
      const insertedTasteId = await db
        .insert(beanTasteTable)
        .values({ flavor: flavorName })
        .returning({ id: beanTasteTable.id });

      await db.insert(beanTasteAssociationTable).values({
        beanId: Number(beanId),
        tasteId: insertedTasteId[0].id,
      });

      reset();
      clearError();
      update();
    } catch (error) {
      console.error("Error saving taste:", error);
    }
  };

  useAutoFocus(inputRef, open);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View flex={1} bgC="$screenBackground">
        <ScrollView flex={1} padding="$4" keyboardShouldPersistTaps="handled">
          <View>
            <ThemedText
              fw={500}
              mt={"$2"}
              color={"$primary"}
              fontSize={getFontSize("$8")}
              lineHeight={getFontSize("$8")}
            >
              {t("common.currentSelection")}
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
              {t("common.suggestions")}
            </ThemedText>
            <XStack gap="$2" flexWrap="wrap" mt="$3">
              {beanSuggestionTasteData?.map(({ id: tasteId, flavor }, index) => (
                <FilterChip
                  key={index}
                  id={tasteId}
                  name={flavor ?? ""}
                  onPress={() => handleSuggestionPress(tasteId)}
                />
              ))}
            </XStack>
          </View>
        </ScrollView>
      </View>

      <XStack flex={0} py="$4" px="$4" bgC={"$white"}>
        <View flex={1}>
          <Controller
            name="flavorName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                ref={inputRef}
                value={value}
                returnKeyType="done"
                onChangeText={(text) => {
                  onChange(text);
                  checkInput(text);
                }}
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyLabel={t("common.done")}
                submitBehavior="submit"
                borderColor={duplicateError ? "$red10" : undefined}
              />
            )}
          />
          {duplicateError && (
            <Text mt="$2" fontSize={12} color="$red10">
              {duplicateError}
            </Text>
          )}
        </View>
        <View flex={0} ml="$3" height={48} justifyContent="center">
          <Pressable onPress={() => updateTasteSheet({ showSheet: false, type: "edit" })}>
            <Text>{t("common.cancel")}</Text>
          </Pressable>
        </View>
      </XStack>
    </KeyboardAvoidingView>
  );
};
export default EditBeanTasteFrame;
