import SaveIcon from "@/components/ui/Icons/Save";
import { roasteryTable } from "@/db/schema";
import { db } from "@/services/db-service";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { createInsertSchema } from "drizzle-zod";
import { Button, Input, Text, View, XStack } from "tamagui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

interface AddRoasteryFormInput {
  name: string;
}

interface Props {
  onFormSubmit: () => void;
}
const AddRoasteryForm: FC<Props> = ({ onFormSubmit }) => {
  const insertSchema = createInsertSchema(roasteryTable);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoasteryFormInput>({ resolver: zodResolver(insertSchema) });

  const { data: roasteryData } = useLiveQuery(db.select().from(roasteryTable));

  const onSubmit = async (data: AddRoasteryFormInput) => {
    await db.insert(roasteryTable).values({
      name: data.name,
    });
    onFormSubmit();
    reset();
  };

  console.log(errors);

  return (
    <View flex={1} p="$8">
      <Text fontSize="$8" mb="$4">
        Rösterei anlegen
      </Text>
      <XStack gap="$2">
        <View flex={1}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Bitte geben Sie einen Namen ein!" }}
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
            bgC="$primaryGreen"
            onPress={handleSubmit(onSubmit)}
            pressStyle={{ bgC: "$primaryGreen" }}
          >
            <SaveIcon />
          </Button>
        </View>
      </XStack>
    </View>
  );
};

export default AddRoasteryForm;
