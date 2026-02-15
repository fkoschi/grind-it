import { roasteryTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, ScrollView, Text, View, XStack, YStack } from "tamagui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddIcon } from "@/components/ui/Icons";
import { Check } from "@tamagui/lucide-icons";
import { useTranslation } from "react-i18next";

interface AddRoasteryFormInput {
  name: string;
}

const insertSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface SelectRoasteryFrameProps {
  selectedRoasteryId?: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}

const SelectRoasteryFrame: FC<SelectRoasteryFrameProps> = ({
  selectedRoasteryId,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const { db } = useDatabase();
  const { data: roasteries } = useLiveQuery(db.select().from(roasteryTable));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoasteryFormInput>({ resolver: zodResolver(insertSchema) });

  const onSubmit = async (data: AddRoasteryFormInput) => {
    try {
      const result = await db
        .insert(roasteryTable)
        .values({ name: data.name })
        .returning({ id: roasteryTable.id });
      reset();
      onSelect(result[0].id);
      onClose();
    } catch (error) {
      console.error("Error inserting roastery", error);
    }
  };

  const handleSelect = (id: number) => {
    onSelect(id);
    onClose();
  };

  const isRequiredError = errors?.name?.type === "invalid_type";

  return (
    <View flex={1} p="$4">
      <Text fontSize="$8" mb="$4">
        {t("addBean.roastery")}
      </Text>

      <XStack gap="$2" alignItems="center" mb="$4">
        <View flex={1}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur } }) => (
              <Input
                placeholder={t("roastery.addTitle")}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="default"
              />
            )}
          />
        </View>
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
      </XStack>
      {isRequiredError && (
        <Text mb="$2" color="$error" fontSize="$2">
          {t("roastery.validation.nameRequired")}
        </Text>
      )}

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$2">
          {roasteries?.map((roastery) => (
            <Button
              key={roastery.id}
              onPress={() => handleSelect(roastery.id)}
              bgC={roastery.id === selectedRoasteryId ? "$secondary" : "$white"}
              color={roastery.id === selectedRoasteryId ? "white" : "$secondary"}
              justifyContent="flex-start"
              pressStyle={{ bgC: "$secondaryHover" }}
              size="$4"
              borderRadius="$4"
            >
              <XStack flex={1} justifyContent="space-between" alignItems="center">
                <Text
                  color={roastery.id === selectedRoasteryId ? "white" : "$secondary"}
                  fontSize="$4"
                >
                  {roastery.name}
                </Text>
                {roastery.id === selectedRoasteryId && <Check size={18} color="white" />}
              </XStack>
            </Button>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default SelectRoasteryFrame;
