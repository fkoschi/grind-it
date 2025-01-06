import { roasteryTable } from "@/db/schema";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { createInsertSchema } from "drizzle-zod";
import { Button, Input, Text, View, XStack } from "tamagui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import AddIcon from "@/components/ui/Icons/Add";
import { useDatabase } from "@/provider/DatabaseProvider";

interface AddRoasteryFormInput {
  name: string;
}

interface Props {
  onFormSubmit: () => void;
}
const AddRoasteryForm: FC<Props> = ({ onFormSubmit }) => {
  const { db } = useDatabase();
  const insertSchema = createInsertSchema(roasteryTable);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoasteryFormInput>({ resolver: zodResolver(insertSchema) });

  const { data: roasteryData } = useLiveQuery(db.select().from(roasteryTable));

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
            render={({ field }) => (
              <Input
                placeholder="Name"
                onChangeText={field.onChange}
                keyboardType="default"
                {...field}
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

export default AddRoasteryForm;
