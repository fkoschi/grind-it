import Badge from "@/components/ui/Badge/Badge";
import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useBeanStore } from "@/store/bean-store";
import { Taste } from "@/types";
import { eq, notInArray } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Input, View, XStack, Text, ScrollView } from "tamagui";
import FilterChip from "@/components/ui/FilterChip/FilterChip";

interface BeanTasteForm {
  flavorName: string;
}

const EditTasteSheet: FC = () => {
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();
  const [beanTasteData, setBeanTasteData] = useState<Taste[]>([]);
  const [beanSuggestionTasteData, setBeanSuggestionTasteData] = useState<
    Taste[]
  >([]);

  const { control, reset, handleSubmit } = useForm<BeanTasteForm>();
  const updateTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);

  const preparedBeanTasteQuery = db
    .select({ id: beanTasteTable.id, flavor: beanTasteTable.flavor })
    .from(beanTasteTable)
    .innerJoin(
      beanTasteAssociationTable,
      eq(beanTasteAssociationTable.tasteId, beanTasteTable.id)
    )
    .where(eq(beanTasteAssociationTable.beanId, Number(beanId)))
    .prepare();

  const preparedBeanSuggestionTasteQuery = (beanTasteFilter: number[]) => {
    console.log(beanTasteFilter);
    return db
      .select({ id: beanTasteTable.id, flavor: beanTasteTable.flavor })
      .from(beanTasteTable)
      .where(notInArray(beanTasteTable.id, beanTasteFilter))
      .prepare();
  };

  const fetchBeanTasteData = () => {
    return preparedBeanTasteQuery.all();
  };

  const fetchBeanSuggestionTasteData = (beanTasteFilter: number[]) => {
    return preparedBeanSuggestionTasteQuery(beanTasteFilter).all();
  };

  const update = () => {
    const beanTasteData = fetchBeanTasteData();
    setBeanTasteData(beanTasteData);

    const beanTasteFilter = beanTasteData.map((taste) => taste.id);
    const beanTasteSuggestionData =
      fetchBeanSuggestionTasteData(beanTasteFilter);
    setBeanSuggestionTasteData(beanTasteSuggestionData);
  };

  useEffect(() => {
    update();
  }, []);

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
      (taste: Taste) => taste.flavor.toLowerCase() === flavorName.toLowerCase()
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View flex={1} bgC="$screenBackground">
        <ScrollView flex={1} padding="$4">
          <View>
            <Text>Auswahl:</Text>
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
            <Text>Vorschläge:</Text>
            <XStack gap="$2" flexWrap="wrap" mt="$3">
              {beanSuggestionTasteData?.map(
                ({ id: tasteId, flavor }, index) => (
                  <FilterChip
                    key={index}
                    id={tasteId}
                    name={flavor ?? ""}
                    onPress={() => handleSuggestionPress(tasteId)}
                  />
                )
              )}
            </XStack>
          </View>
        </ScrollView>
      </View>

      <XStack
        flex={0}
        py="$4"
        px="$4"
        bgC={"$white"}
      >
        <View flex={1} height={48} justifyContent="center">
          <Controller
            name="flavorName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChangeText={field.onChange}
                returnKeyType="done"
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
export default EditTasteSheet;
