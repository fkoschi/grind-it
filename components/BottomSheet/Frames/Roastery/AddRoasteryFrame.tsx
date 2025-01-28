import { roasteryTable } from "@/db/schema";
import { FC, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { createInsertSchema } from "drizzle-zod";
import { Button, Input, Text, View, XStack } from "tamagui";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddIcon } from "@/components/ui/Icons";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useAutoFocus } from "@/hooks/useAutoFocus";

interface AddRoasteryFormInput {
  name: string;
}

interface AddRoasteryFrameProps {
  open: boolean;
  onFormSubmit: () => void;
}
const AddRoasteryFrame: FC<AddRoasteryFrameProps> = ({
  open,
  onFormSubmit,
}) => {
  const { db } = useDatabase();
  const insertSchema = createInsertSchema(roasteryTable);
  const inputRef = useRef<Input>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoasteryFormInput>({ resolver: zodResolver(insertSchema) });

  const onSubmit = async (data: AddRoasteryFormInput) => {
    try {
      await db.insert(roasteryTable).values({
        name: data.name,
      });
    } catch (error) {
      console.error("Error inserting roastery", error);
    }

    onFormSubmit();
    reset();
  };

  useAutoFocus(inputRef, open);

  const isRequiredError = errors?.name?.type === "invalid_type";

  return (
    <View flex={1} p="$8">
      <Text fontSize="$8" mb="$4">
        Rösterei anlegen
      </Text>
      <XStack gap="$2" alignItems="center">
        <View flex={1}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur } }) => (
              <Input
                ref={inputRef}
                placeholder="Name"
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="default"
              />
            )}
          />
        </View>

        <View>
          <Button
            circular
            bgC="$secondary"
            height={32}
            minHeight={32}
            width={32}
            minWidth={32}
            onPress={handleSubmit(onSubmit)}
            pressStyle={{ bgC: "$secondaryHover" }}
          >
            <AddIcon />
          </Button>
        </View>
      </XStack>
      {isRequiredError && (
        <Text mt="$2" color="$error" fontSize="$2">
          Bitte geben Sie einen Namen ein!
        </Text>
      )}
    </View>
  );
};

export default AddRoasteryFrame;
