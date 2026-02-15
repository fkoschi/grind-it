import { beanTable, beanTasteAssociationTable, beanTasteTable, roasteryTable } from "@/db/schema";
import React, { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Badge,
  CheckIcon,
  PercentageIcon,
  InputWithIcon,
  StepperInput,
} from "@/components/ui";
import { Text, Input, View, XStack, Button, ScrollView } from "tamagui";
import { useBeanStore } from "@/store/bean-store";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDatabase } from "@/provider/DatabaseProvider";
import { Taste } from "@/types";
import EditBean from "./bean/EditBean";
import BeanHeaderLayout from "@/components/BeanHeaderLayout/BeanHeaderLayout";
import { ChevronDown } from "@tamagui/lucide-icons";

interface FormInput {
  name: string;
  roastery: number;
  arabicaAmount: number;
  robustaAmount: number;
  singleShotDosis: number;
  doubleShotDosis: number;
}

const insertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roastery: z.number().int().positive().optional(),
  arabicaAmount: z.number().int().min(0).max(100).optional(),
  robustaAmount: z.number().int().min(0).max(100).optional(),
  singleShotDosis: z.number().positive().optional(),
  doubleShotDosis: z.number().positive().optional(),
});

const AddBeanPage: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { db } = useDatabase();
  const beanTaste = useBeanStore((state) => state.taste);
  const resetBeanState = useBeanStore((state) => state.clearBeanTaste);
  const removeBeanTaste = useBeanStore((state) => state.removeBeanTaste);
  const updateSelectRoastery = useBeanStore((state) => state.updateSelectRoastery);
  const updateEditBeanTaste = useBeanStore((state) => state.updateEditBeanTaste);

  const { data: roasteries } = useLiveQuery(db.select().from(roasteryTable));

  const {
    handleSubmit,
    control,
    reset: resetForm,
    setValue,
    watch,
  } = useForm<FormInput>({
    resolver: zodResolver(insertSchema),
    defaultValues: {
      singleShotDosis: 8,
      doubleShotDosis: 16,
    },
  });

  const onSubmit = async (data: FormInput) => {
    const beanId = await insertBean(data);

    if (beanTaste.length > 0) {
      const tasteForBeanTable = beanTaste
        .filter((taste) => taste.id === -1)
        .map((taste) => ({ flavor: taste.flavor }));
      const beanTasteAssociationValueIds = beanTaste
        .filter((taste) => taste.id !== -1)
        .map((taste) => ({ id: taste.id }));
      await insertTaste(beanId.id, tasteForBeanTable, beanTasteAssociationValueIds);
    }
    router.dismissTo("/");
  };

  const insertBean = async (data: FormInput) => {
    const beanId = await db
      .insert(beanTable)
      .values({
        name: data.name,
        robustaAmount: data.robustaAmount,
        arabicaAmount: data.arabicaAmount,
        roastery: data.roastery,
        singleShotDosis: data.singleShotDosis,
        doubleShotDosis: data.doubleShotDosis,
      })
      .returning({ id: beanTable.id });

    return beanId[0];
  };

  const insertTaste = async (
    beanId: number,
    beanTasteValues: Pick<Taste, "flavor">[],
    beanTasteAssociationValueIds: Pick<Taste, "id">[],
  ) => {
    const tasteIds = await db
      .insert(beanTasteTable)
      .values(beanTasteValues)
      .returning({ id: beanTasteTable.id });

    const insertAssociationValues = [...tasteIds, ...beanTasteAssociationValueIds].map((taste) => ({
      beanId,
      tasteId: taste.id,
    }));

    await db.insert(beanTasteAssociationTable).values(insertAssociationValues);
  };

  useEffect(() => {
    resetForm();
    resetBeanState();
  }, [resetBeanState, resetForm]);

  const selectedRoasteryId = watch("roastery");

  return (
    <EditBean
      selectedRoasteryId={selectedRoasteryId}
      onRoasterySelect={(id) => setValue("roastery", id)}
    >
      <View flex={1}>
        <BeanHeaderLayout />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={16}
        >
          <ScrollView flex={1} padding="$6">
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

            <View mb="$3">
              <Controller
                name="roastery"
                control={control}
                render={({ field }) => {
                  const selectedRoastery = roasteries?.find((r) => r.id === field.value);
                  return (
                    <Button
                      bgC="white"
                      borderRadius="$4"
                      justifyContent="space-between"
                      onPress={() => updateSelectRoastery(true)}
                      pressStyle={{ bgC: "$screenBackground" }}
                      size="$4"
                      iconAfter={<ChevronDown size={16} color="$secondary" />}
                    >
                      <Text color={selectedRoastery ? "$secondary" : "$placeholderColor"}>
                        {selectedRoastery?.name ?? t("addBean.roastery")}
                      </Text>
                    </Button>
                  );
                }}
              />
            </View>

            <XStack gap="$8" mb="$3">
              <Controller
                name="arabicaAmount"
                control={control}
                render={({ field: { onChange, value }, ...other }) => (
                  <InputWithIcon
                    id="arabicaAmount"
                    onChangeText={(text: string) => onChange(Number(text))}
                    keyboardType="decimal-pad"
                    value={value?.toString()}
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

            <XStack gap="$8" mb="$3">
              <Controller
                name="singleShotDosis"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <StepperInput value={value} onChange={onChange} label="Single Shot" />
                )}
              />

              <Controller
                control={control}
                name="doubleShotDosis"
                render={({ field: { onChange, value } }) => (
                  <StepperInput value={value} onChange={onChange} label="Double Shot" />
                )}
              />
            </XStack>

            <View flex={0} mt="$4">
              <Text fontSize="$6">{t("addBean.taste")}</Text>
              {beanTaste && (
                <View flex={0} flexDirection="row" gap="$2" pt="$3" flexWrap="wrap" mb="$4">
                  {beanTaste.map((taste: Taste, index) => (
                    <Badge
                      key={`bean-badge-${taste}-${index}`}
                      title={taste.flavor}
                      onPress={() => removeBeanTaste(taste)}
                      withButton
                    />
                  ))}
                </View>
              )}
              {!beanTaste.length && (
                <XStack flex={0} height="$8" justifyContent="center">
                  <Image
                    source={require("@/assets/images/latte-art.png")}
                    style={{ width: 80, height: 80 }}
                  />
                </XStack>
              )}
              <View flex={1}>
                <Button
                  mt="$2"
                  bgC="$secondary"
                  color="white"
                  size="$3"
                  onPress={() => updateEditBeanTaste({ showSheet: true, type: "add" })}
                  pressStyle={{
                    backgroundColor: "$secondary",
                  }}
                >
                  {t("addBean.editTaste")}
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <ActionButton
        bgC="#7AA996"
        onPress={handleSubmit(onSubmit)}
        icon={<CheckIcon />}
        pressStyle={{ bgC: "$primaryGreen" }}
      />
    </EditBean>
  );
};

export default AddBeanPage;
