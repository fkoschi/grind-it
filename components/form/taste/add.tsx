import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInputSubmitEditingEventData,
} from "react-native";
import { Input, Text, View, XStack } from "tamagui";
import { useBeanStore } from "@/store/bean-store";
import AddBeanFormTaste from "./ui/taste";
import AddBeanFormSuggestions from "./ui/suggestions";
import { selectTasteInArray, selectTasteNotInArray } from "@/db/queries";

interface AddTasteFormInput {
  name: string;
}

interface Props {}
const AddTasteForm: FC<Props> = () => {
  const [value, setValue] = useState<string>("");
  const beanTastes = useBeanStore((state) => state.taste);
  const addBeanTaste = useBeanStore((state) => state.addBeanTaste);
  const showTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);
  const [activeSuggestions, setActiveSuggestions] = useState<Array<number>>([]);
  const { control, reset } = useForm<AddTasteFormInput>();

  const handleSubmit = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    e.preventDefault();

    // TODO: Don't allow duplicate entries to be stored!
    addBeanTaste(value);
    clear();
  };

  const clear = () => {
    setValue("");
    reset({ name: "" });
  };

  console.log({ activeSuggestions });

  // Select all available taste entries from DB
  const suggestionData = selectTasteNotInArray(activeSuggestions).all();
  const selectedSuggestionData = selectTasteInArray(activeSuggestions).all();

  console.log({ suggestionData, selectedSuggestionData });

  const handleSuggestionPress = (id: number) => {
    const isSet = activeSuggestions.includes(id);

    if (isSet) {
      const updatedSuggestions = activeSuggestions.filter(
        (suggestion) => suggestion !== id
      );
      setActiveSuggestions(updatedSuggestions);
    } else {
      setActiveSuggestions((prev) => [...prev, id]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={16}
    >
      <View flex={1} p="$4" bgC="$screenBackground">
        <AddBeanFormTaste
          data={beanTastes}
          suggestionData={
            activeSuggestions.length > 0 ? selectedSuggestionData : []
          }
          onSuggestionPress={handleSuggestionPress}
        />
        <AddBeanFormSuggestions
          data={suggestionData}
          onPress={handleSuggestionPress}
        />
      </View>
      <XStack
        flex={1}
        py="$4"
        pt="$2"
        pb="$0"
        alignContent="center"
        bottom={0}
        width="100%"
      >
        <View flex={1} height={48} justifyContent="center">
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
        <View flex={0} ml="$3" height={48} justifyContent="center">
          <Pressable onPress={() => showTasteSheet(false)}>
            <Text>Abbrechen</Text>
          </Pressable>
        </View>
      </XStack>
    </KeyboardAvoidingView>
  );
};
export default AddTasteForm;
