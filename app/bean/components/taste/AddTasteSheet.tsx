import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInputSubmitEditingEventData,
} from "react-native";
import { Input, ScrollView, Text, View, XStack } from "tamagui";
import { useBeanStore } from "@/store/bean-store";
import AddBeanFormTaste from "./AddBeanFormTaste";
import AddBeanFormSuggestions from "./AddBeanFormSuggestions";
import { selectTasteNotInArray } from "@/db/queries";
import { useDatabase } from "@/provider/DatabaseProvider";
import { Taste } from "@/types";

interface AddTasteFormInput {
  name: string;
}
const AddTasteSheet: FC = () => {
  const { db } = useDatabase();
  const [value, setValue] = useState<string>("");
  const beanTaste = useBeanStore((state) => state.taste);
  const addBeanTaste = useBeanStore((state) => state.addBeanTaste);
  const showTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);

  const { control, reset } = useForm<AddTasteFormInput>();

  const handleSubmit = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    e.preventDefault();

    if (value.trim().length === 0) {
      return;
    }

    // TODO: Don't allow duplicate entries to be stored!
    addBeanTaste({ id: -1, flavor: value.trim() });
    clear();
  };

  const clear = () => {
    setValue("");
    reset({ name: "" });
  };

  // Select all available taste entries from DB
  const suggestionData = selectTasteNotInArray(
    db,
    beanTaste.map((taste) => {
      if (taste.id !== -1) {
        return taste.id;
      }
      return 0;
    })
  ).all();

  const handleSuggestionPress = ({ id, flavor }: Taste) => {
    addBeanTaste({ id, flavor });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View flex={1} bgC="$screenBackground">
        <ScrollView flex={1} p="$4">
          <AddBeanFormTaste tasteData={beanTaste} />
          <AddBeanFormSuggestions
            tasteData={suggestionData}
            onPress={handleSuggestionPress}
          />
        </ScrollView>
        <XStack flex={0} py="$4" px="$4" bgC={"$white"}>
          <View flex={1} justifyContent="center">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                  onChangeText={(text) => setValue(text)}
                  returnKeyLabel="Fertig"
                  blurOnSubmit={false}
                />
              )}
            />
          </View>
          <View flex={0} ml="$3" justifyContent="center">
            <Pressable
              onPress={() => showTasteSheet({ showSheet: false, type: "add" })}
            >
              <Text>Abbrechen</Text>
            </Pressable>
          </View>
        </XStack>
      </View>
    </KeyboardAvoidingView>
  );
};
export default AddTasteSheet;
