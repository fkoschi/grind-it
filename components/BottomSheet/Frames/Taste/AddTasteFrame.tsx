import { beanTasteTable } from "@/db/schema";
import { useAutoFocus } from "@/hooks/useAutoFocus";
import { useDuplicateCheck } from "@/hooks/useDuplicateCheck";
import { useDatabase } from "@/provider/DatabaseProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { Input, Text, View, XStack } from "tamagui";
import { z } from "zod";
import { useTranslation } from "react-i18next";

interface AddTasteFrameProps {
  open?: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const AddTasteFrame: FC<AddTasteFrameProps> = ({ open, onCancel, onSave }) => {
  const { t } = useTranslation();
  const { db } = useDatabase();
  const inputRef = useRef<Input>(null);
  const { duplicateError, checkInput, clearError } = useDuplicateCheck({
    table: beanTasteTable,
    fieldName: "flavor",
  });

  const Taste = z.object({
    taste: z.string().nonempty(t("taste.validationEmpty")),
  });
  type TasteT = z.infer<typeof Taste>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TasteT>({
    resolver: zodResolver(Taste),
  });

  const onSubmit: SubmitHandler<TasteT> = async (data) => {
    if (duplicateError) {
      return;
    }

    try {
      await db.insert(beanTasteTable).values({ flavor: data.taste });
      reset();
      clearError();
      onSave();
    } catch (error) {
      console.error("Error saving taste:", error);
    }
  };

  const handleCancel = () => {
    reset();
    clearError();
    onCancel();
  };

  useAutoFocus(inputRef, open);

  return (
    <View flex={1} p="$6">
      <Text fontSize={26} color={"$primary"} fontFamily="$sodabery">
        {t("taste.addTitle")}
      </Text>
      <Text mt="$2" fontSize={12} color={"$copyText"}>
        {t("taste.addDescription")}
      </Text>

      <XStack mt="$6">
        <View flex={1}>
          <Controller
            name="taste"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={inputRef}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  checkInput(text);
                }}
                onBlur={onBlur}
                returnKeyType="done"
                returnKeyLabel={t("common.done")}
                onEndEditing={handleSubmit(onSubmit)}
                borderColor={duplicateError ? "$red10" : undefined}
              />
            )}
          />
          {(duplicateError || errors.taste) && (
            <Text mt="$2" fontSize={12} color="$red10">
              {duplicateError || errors.taste?.message}
            </Text>
          )}
        </View>
        <View flex={0} ml="$3" pt="$2.5">
          <Pressable onPress={handleCancel}>
            <Text>{t("common.cancel")}</Text>
          </Pressable>
        </View>
      </XStack>
    </View>
  );
};
export default AddTasteFrame;
