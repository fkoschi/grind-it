import { beanTasteTable } from "@/db/schema";
import { useAutoFocus } from "@/hooks/useAutoFocus";
import { useDatabase } from "@/provider/DatabaseProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { View, Text, XStack, Input } from "tamagui";
import { z } from "zod";

interface AddTasteFrameProps {
  open?: boolean;
  onCancel: () => void;
  onSave: () => void;
}
const AddTasteFrame: FC<AddTasteFrameProps> = ({ open, onCancel, onSave }) => {
  const { db } = useDatabase();
  const inputRef = useRef<Input>(null);

  const Taste = z.object({
    taste: z.string().nonempty(),
  });
  type TasteT = z.infer<typeof Taste>;

  const { control, handleSubmit, reset } = useForm<TasteT>({
    resolver: zodResolver(Taste),
  });

  const onSubmit: SubmitHandler<TasteT> = async (data) => {
    await db.insert(beanTasteTable).values({ flavor: data.taste });
    onSave();
    reset();
  };

  useAutoFocus(inputRef, open);

  return (
    <View flex={1} p="$6">
      <Text
        fontSize={26}
        color={"$primary"}
        fontFamily="TBJSodabery-LightOriginal"
      >
        Neuer Geschmack
      </Text>
      <Text mt="$2" fontSize={12} color={"$copyText"}>
        Dieser Geschmack wird unabhängig von einer Bohne erstellt und kann
        später zu beliebig vielen Bohnen zugeordnet werden.
      </Text>

      <XStack mt="$6">
        <Controller
          name="taste"
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <Input
              flex={1}
              ref={inputRef}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
              returnKeyLabel="Fertig"
              onEndEditing={handleSubmit(onSubmit)}
            />
          )}
        />
        <View flex={0} justifyContent="center" ml="$3">
          <Pressable onPress={onCancel}>
            <Text>Abbrechen</Text>
          </Pressable>
        </View>
      </XStack>
    </View>
  );
};
export default AddTasteFrame;
