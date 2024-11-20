import ActionButton from "@/components/ui/ActionButton/ActionButton";
import AddIcon from "@/components/ui/Icons/Add";
import CheckIcon from "@/components/ui/Icons/Check";
import PercentageIcon from "@/components/ui/Icons/Percentage";
import InputWithIcon from "@/components/ui/Input/InputWithIcon";
import { beanTable, roasteryTable } from "@/db/schema";
import { db } from "@/services/db-service";
import { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Text, Input, View, XStack, Button } from "tamagui";
import { useBeanStore } from "@/store/bean-store";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

interface FormInput {
  name: string;
  arabicaAmount: number;
  robustaAmount: number;
}

const AddBeanPage: FC = () => {
  const updateEditRoastery = useBeanStore((state) => state.updateEditRoastery);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      name: "",
      arabicaAmount: 0,
      robustaAmount: 0,
    },
  });

  const onSubmit = async (data: FormInput) => {
    console.log("Form Submitted: ", data);

    await db.insert(beanTable).values({
      name: data.name,
      robustaAmount: data.robustaAmount,
      arabicaAmount: data.arabicaAmount,
      roastery: 1,
    });
  };

  const { data: roasteryData } = useLiveQuery(db.select().from(roasteryTable));

  console.log(roasteryData);

  return (
    <View flex={1}>
      <View flex={1} padding="$6">
        <XStack gap="$8" mb="$3">
          <Controller
            name="arabicaAmount"
            control={control}
            render={({ field: { onChange, value }, ...other }) => (
              <InputWithIcon
                id="arabicaAmount"
                onChangeText={(text: string) => onChange(Number(text))}
                keyboardType="decimal-pad"
                value={value.toString()}
                suffix={<PercentageIcon />}
                label="Arabica"
                style={{ maxWidth: 80 }}
                {...other}
              />
            )}
          />

          <Controller
            control={control}
            name="robustaAmount"
            render={({ field: { onChange, value }, ...other }) => (
              <InputWithIcon
                id="robustaAmount"
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="decimal-pad"
                value={value?.toString() || ""}
                suffix={<PercentageIcon />}
                label="Robusta"
                {...other}
              />
            )}
          />
        </XStack>

        <View mb="$3">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required!" }}
            render={({ field }) => (
              <Input
                placeholder="Name"
                keyboardType="default"
                onChangeText={field.onChange}
                borderRadius="$4"
                bgC="white"
                {...field}
              />
            )}
          />
        </View>

        <XStack
          flex={0}
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <View flex={1}>
            <Text>Placeholder</Text>
          </View>
          <View>
            <Button
              circular
              bgC="$secondary"
              height={32}
              width={32}
              minHeight={32}
              minWidth={32}
              onPress={() => updateEditRoastery(true)}
              pressStyle={{
                bgC: "$secondaryHover",
              }}
            >
              <AddIcon size={18} />
            </Button>
          </View>
        </XStack>

        {/* <View mt="$2">
          <ThemedSelect
            placeholder="Rösterei"
            items={[{ name: "Fausto" }, { name: "Supremo" }]}
          />
        </View> */}
      </View>

      <ActionButton
        bgC="#7AA996"
        onPress={handleSubmit(onSubmit)}
        icon={<CheckIcon />}
      />
    </View>
  );
};

export default AddBeanPage;
