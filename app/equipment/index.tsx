import { FC } from "react";
import { View, Text, ScrollView, Input, YStack, Select, Adapt, Sheet } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { ChevronDown } from "@tamagui/lucide-icons";
import { useDatabase } from "@/provider/DatabaseProvider";
import { machineTable, grinderTable, MachineType, INTEGRATED_GRINDER_TYPES } from "@/db/schema";
import {
  useEquipmentData,
  ESPRESSO_TYPES,
  FILTER_TYPES,
  OTHER_TYPES,
} from "@/hooks/useEquipmentData";
import ThemedText from "@/components/ui/Text/ThemedText";
import { ActionButton, SaveIcon } from "@/components/ui";

const equipmentSchema = z.object({
  machineManufacturer: z.string().min(1),
  machineName: z.string().min(1),
  machineType: z.string().min(1),
  grinderManufacturer: z.string(),
  grinderName: z.string(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

const EquipmentScreen: FC = () => {
  const { machine, grinder } = useEquipmentData();
  const { db } = useDatabase();
  const router = useRouter();
  const { top: topInset } = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    values: {
      machineManufacturer: machine?.manufacturer ?? "",
      machineName: machine?.name ?? "",
      machineType: machine?.type ?? MachineType.SEMI_AUTOMATIC,
      grinderManufacturer: grinder?.manufacturer ?? "",
      grinderName: grinder?.name ?? "",
    },
  });

  const currentMachineType = watch("machineType") as MachineType;
  const showGrinderSection = !INTEGRATED_GRINDER_TYPES.includes(currentMachineType);

  const onSubmit = async (data: EquipmentFormValues) => {
    await db
      .insert(machineTable)
      .values({
        id: 1,
        manufacturer: data.machineManufacturer,
        name: data.machineName,
        type: data.machineType,
      })
      .onConflictDoUpdate({
        target: machineTable.id,
        set: {
          manufacturer: data.machineManufacturer,
          name: data.machineName,
          type: data.machineType,
        },
      });

    await db
      .insert(grinderTable)
      .values({ id: 1, manufacturer: data.grinderManufacturer, name: data.grinderName })
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
            Equipment
          </Text>
        </View>
      </LinearGradient>

      <ScrollView flex={1} py="$6" px="$6">
        <YStack gap="$4" pb="$12">
          <ThemedText fw={700} fontSize={16} color="$copyText">
            Machine
          </ThemedText>

          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              Manufacturer
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
              Name
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

          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              Type
            </ThemedText>
            <Controller
              name="machineType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <Select.Trigger
                    borderWidth={0}
                    bgC="white"
                    borderRadius="$4"
                    size="$4"
                    iconAfter={ChevronDown}
                  >
                    <Select.Value placeholder="Select type..." />
                  </Select.Trigger>

                  <Adapt when="sm" platform="touch">
                    <Sheet
                      native
                      modal
                      dismissOnSnapToBottom
                      snapPoints={[60]}
                      snapPointsMode="percent"
                    >
                      <Sheet.Frame>
                        <Sheet.ScrollView>
                          <Adapt.Contents />
                        </Sheet.ScrollView>
                      </Sheet.Frame>
                      <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                      />
                    </Sheet>
                  </Adapt>

                  <Select.Content zIndex={200_000_000}>
                    <Select.Viewport minWidth={200}>
                      <Select.Group>
                        <Select.Label>Espresso</Select.Label>
                        {ESPRESSO_TYPES.map((type, i) => (
                          <Select.Item index={i} key={type.value} value={type.value}>
                            <Select.ItemText>{type.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Group>
                        <Select.Label>Manual / Filter</Select.Label>
                        {FILTER_TYPES.map((type, i) => (
                          <Select.Item
                            index={ESPRESSO_TYPES.length + i}
                            key={type.value}
                            value={type.value}
                          >
                            <Select.ItemText>{type.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Group>
                        <Select.Label>Other</Select.Label>
                        {OTHER_TYPES.map((type, i) => (
                          <Select.Item
                            index={ESPRESSO_TYPES.length + FILTER_TYPES.length + i}
                            key={type.value}
                            value={type.value}
                          >
                            <Select.ItemText>{type.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select>
              )}
            />
          </YStack>

          {showGrinderSection ? (
            <>
              <ThemedText fw={700} fontSize={16} color="$copyText">
                Grinder
              </ThemedText>

              <YStack gap="$2">
                <ThemedText fw={600} fontSize={12} color="$copyText">
                  Manufacturer
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
                  Name
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
            </>
          ) : null}
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
