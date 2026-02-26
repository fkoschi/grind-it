import { FC } from "react";
import { View, Text, ScrollView, Input, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useDatabase } from "@/provider/DatabaseProvider";
import { machineTable, grinderTable, MachineType } from "@/db/schema";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import ThemedText from "@/components/ui/Text/ThemedText";
import { ActionButton, SaveIcon } from "@/components/ui";
import { useTranslation } from "react-i18next";

const equipmentSchema = z.object({
  machineManufacturer: z.string().min(1),
  machineName: z.string().min(1),
  grinderManufacturer: z.string(),
  grinderName: z.string(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

const EquipmentScreen: FC = () => {
  const { machine, grinder } = useEquipmentData();
  const { db } = useDatabase();
  const router = useRouter();
  const { top: topInset } = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    values: {
      machineManufacturer: machine?.manufacturer ?? "",
      machineName: machine?.name ?? "",
      grinderManufacturer: grinder?.manufacturer ?? "",
      grinderName: grinder?.name ?? "",
    },
  });

  const onSubmit = async (data: EquipmentFormValues) => {
    const machineType = machine?.type ?? MachineType.SEMI_AUTOMATIC;
    await db
      .insert(machineTable)
      .values({
        id: 1,
        manufacturer: data.machineManufacturer,
        name: data.machineName,
        type: machineType,
      })
      .onConflictDoUpdate({
        target: machineTable.id,
        set: {
          manufacturer: data.machineManufacturer,
          name: data.machineName,
          type: machineType,
        },
      });

    await db
      .insert(grinderTable)
      .values({
        id: 1,
        manufacturer: data.grinderManufacturer,
        name: data.grinderName,
      })
      .onConflictDoUpdate({
        target: grinderTable.id,
        set: { manufacturer: data.grinderManufacturer, name: data.grinderName },
      });

    router.back();
  };

  return (
    <View flex={1} bgC="$screenBackground">
      <LinearGradient
        height="$14"
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
        paddingTop={topInset}
      >
        <Pressable
          style={{ position: "absolute", top: topInset + 12, left: 32 }}
          onPress={() => router.back()}
        >
          <Image
            source={require("@/assets/icons/back.png")}
            style={{ width: 24, height: 24, tintColor: "white" }}
          />
        </Pressable>
        <View flex={1} justifyContent="flex-end" alignItems="center">
          <Text fontSize={32} c="$white" fontFamily="$sodabery" mb="$6">
            {t("equipment.title")}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView flex={1} py="$6" px="$6">
        <YStack gap="$2" pb="$12">
          <ThemedText fw={700} fontSize={16} color="$copyText">
            {t("equipment.machine")}
          </ThemedText>
          <ThemedText fw={400} fontSize={13} color="$copyText">
            {t("equipment.description")}
          </ThemedText>

          <YStack gap="$2" mt="$4">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("equipment.manufacturer")}
            </ThemedText>
            <Controller
              name="machineManufacturer"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  borderWidth={0}
                  bgC="white"
                  borderRadius="$4"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  size="$4"
                />
              )}
            />
          </YStack>

          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("equipment.name")}
            </ThemedText>
            <Controller
              name="machineName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  borderWidth={0}
                  bgC="white"
                  borderRadius="$4"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  size="$4"
                />
              )}
            />
          </YStack>

          <ThemedText fw={700} fontSize={16} color="$copyText" mt="$4">
            {t("equipment.grinder")}
          </ThemedText>

          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("equipment.manufacturer")}
            </ThemedText>
            <Controller
              name="grinderManufacturer"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  borderWidth={0}
                  bgC="white"
                  borderRadius="$4"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  size="$4"
                />
              )}
            />
          </YStack>

          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("equipment.name")}
            </ThemedText>
            <Controller
              name="grinderName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  borderWidth={0}
                  bgC="white"
                  borderRadius="$4"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  size="$4"
                />
              )}
            />
          </YStack>
        </YStack>
      </ScrollView>

      {isDirty ? (
        <ActionButton
          bgC="$primaryGreen"
          icon={<SaveIcon />}
          onPress={handleSubmit(onSubmit)}
          pressStyle={{ backgroundColor: "$primaryGreen" }}
        />
      ) : null}
    </View>
  );
};

export default EquipmentScreen;
