import React, { FC, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  Input,
  XStack,
  ScrollView,
  Label,
  YStack,
  Button,
} from "tamagui";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDatabase } from "@/provider/DatabaseProvider";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  AddIcon,
  PercentageIcon,
  Badge,
  InputWithIcon,
  LoadingScreen,
  Select as ThemedSelect,
  StepperInput,
} from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { Image } from "expo-image";

export const PATH_NAME = "/bean/edit";

interface FormState {
  name: string;
  roastery: number;
  arabicaAmount: string;
  robustaAmount: string;
  singleShotDosis: string;
  doubleShotDosis: string;
}
interface BeansTasteInputProps {
  beanTasteData: { id: number; flavor: string | null }[];
  onEditTaste: () => void;
}

const BeansTasteInput: FC<BeansTasteInputProps> = ({
  beanTasteData = [],
  onEditTaste,
}) => {
  const imageSource = require("@/assets/images/latte-art.png");

  return (
    <YStack gap="$1" mt="$2">
      <Text fontSize="$4">Geschmack</Text>
      {!beanTasteData.length && (
        <XStack flex={0} height="$8" justifyContent="center">
          <Image source={imageSource} style={{ width: 80, height: 80 }} />
        </XStack>
      )}
      <View flex={1} gap="$2" flexWrap="wrap" flexDirection="row" mt="$3">
        {beanTasteData.map(({ flavor }, index) => (
          <View key={index} flex={0}>
            <Badge title={flavor ?? ""} />
          </View>
        ))}
      </View>
      <View flex={1} mt="$4">
        <Button
          mt="$2"
          bgC="$secondary"
          color="white"
          size="$3"
          onPress={onEditTaste}
          pressStyle={{
            backgroundColor: "$secondary",
          }}
        >
          Geschmack bearbeiten
        </Button>
      </View>
    </YStack>
  );
};

const EditBeanPage: FC = () => {
  const { db } = useDatabase();
  const { control } = useForm<FormState>();
  const editTaste = useBeanStore((state) => state.editBeanTaste);
  const showTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);
  const showRoasterySheet = useBeanStore((state) => state.updateEditRoastery);
  const { id: beanId } = useLocalSearchParams();

  const { data: beanData } = useLiveQuery(
    db
      .select({
        beanName: beanTable.name,
        arabicaAmount: beanTable.arabicaAmount,
        robustaAmount: beanTable.robustaAmount,
        singleShotDosis: beanTable.singleShotDosis,
        doubleShotDosis: beanTable.doubleShotDosis,
        roastery: roasteryTable.name,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
      .where(eq(beanTable.id, Number(beanId)))
  );
  const { data: roasteryData } = useLiveQuery(db.select().from(roasteryTable));
  const { data: beanTasteData } = useLiveQuery(
    db
      .select({ id: beanTasteTable.id, flavor: beanTasteTable.flavor })
      .from(beanTasteTable)
      .leftJoin(
        beanTasteAssociationTable,
        eq(beanTasteAssociationTable.tasteId, beanTasteTable.id)
      )
      .where(eq(beanTasteAssociationTable.beanId, Number(beanId))),
    [editTaste]
  );

  const handleNameChange = async (name: string) => {
    await db
      .update(beanTable)
      .set({ name: name.trim() })
      .where(eq(beanTable.id, Number(beanId)));
  };
  const handleArabicaAmountChange = async (amount: string) => {
    await db
      .update(beanTable)
      .set({ arabicaAmount: Number(amount) })
      .where(eq(beanTable.id, Number(beanId)));
  };
  const handleRobustaAmountChange = async (amount: string) => {
    await db
      .update(beanTable)
      .set({ robustaAmount: Number(amount) })
      .where(eq(beanTable.id, Number(beanId)));
  };
  const handleRoasteryChange = async (value: number) => {
    await db.update(beanTable).set({ roastery: value });
  };

  const BeanNameInput = () => (
    <View flex={1}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value }, ...props }) => (
          <View>
            <XStack gap="$4">
              <Label minWidth={"$6"}>Name</Label>
              <Input
                {...props}
                flex={1}
                backgroundColor="$white"
                onChangeText={onChange}
                onEndEditing={() => handleNameChange(value)}
                defaultValue={beanData?.[0]?.beanName}
              />
            </XStack>
          </View>
        )}
      />
    </View>
  );
  const handleSingleShotDosisChange = async (amount: string) => {
    await db
      .update(beanTable)
      .set({ singleShotDosis: Number(amount) })
      .where(eq(beanTable.id, Number(beanId)));
  };
  const handleDoubleShotDosisChange = async (amount: string) => {
    await db
      .update(beanTable)
      .set({ doubleShotDosis: Number(amount) })
      .where(eq(beanTable.id, Number(beanId)));
  };

  const BeanDosisInput = () => (
    <View>
      <XStack gap="$4">
        <View flex={1}>
          <Label>Single Shot</Label>
        </View>
        <XStack flex={1} gap="$2">
          <Controller
            name="singleShotDosis"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StepperInput
                step={0.1}
                value={Number(value ?? beanData?.[0]?.singleShotDosis ?? 0)}
                onChange={(val) => {
                  onChange(val.toString());
                  handleSingleShotDosisChange(val.toString());
                }}
              />
            )}
          />
        </XStack>
      </XStack>
      <XStack gap="$4">
        <View flex={1}>
          <Label>Double Shot</Label>
        </View>
        <XStack flex={1} gap="$2">
          <Controller
            name="doubleShotDosis"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StepperInput
                step={0.1}
                value={Number(value ?? beanData?.[0]?.doubleShotDosis ?? 0)}
                onChange={(val) => {
                  onChange(val.toString());
                  handleDoubleShotDosisChange(val.toString());
                }}
              />
            )}
          />
        </XStack>
      </XStack>
    </View>
  );

  const BeanArabicaRobustaInput = () => (
    <XStack gap="$4">
      <Label>Arabica / Robusta</Label>
      <XStack flex={1} gap="$2">
        <Controller
          name="arabicaAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithIcon
              {...props}
              suffix={<PercentageIcon fillColor="#664F3F" />}
              onEndEditing={() => handleArabicaAmountChange(value)}
              onChangeText={onChange}
              defaultValue={beanData?.[0]?.arabicaAmount?.toString()}
            />
          )}
        />
        <Controller
          name="robustaAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithIcon
              {...props}
              suffix={<PercentageIcon fillColor="#664F3F" />}
              onEndEditing={() => handleRobustaAmountChange(value)}
              onChangeText={onChange}
              defaultValue={beanData?.[0]?.robustaAmount?.toString()}
            />
          )}
        />
      </XStack>
    </XStack>
  );
  const BeanRoasteryInput = () => (
    <>
      <Controller
        name="roastery"
        control={control}
        render={({ field, ...props }) => (
          <View>
            <XStack gap="$4" alignItems="center">
              <Label minWidth={"$6"}>Rösterei</Label>
              <View flex={1}>
                <ThemedSelect
                  label="Rösterei"
                  items={roasteryData}
                  value={beanData?.[0]?.roastery}
                  onChange={handleRoasteryChange}
                  {...props}
                />
              </View>
              <Button
                bgC="$secondary"
                circular
                minWidth={32}
                width={32}
                minHeight={32}
                height={32}
                pressStyle={{
                  bgC: "$secondaryHover",
                }}
                onPress={() => showRoasterySheet(true)}
              >
                <AddIcon size={18} />
              </Button>
            </XStack>
          </View>
        )}
      />
    </>
  );

  if (beanData.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView flex={1} py="$6" px="$4">
      <YStack gap="$2">
        <BeanDosisInput />
        <BeanArabicaRobustaInput />
        <BeanNameInput />
        <BeanRoasteryInput />
        <BeansTasteInput
          beanTasteData={beanTasteData ?? []}
          onEditTaste={() => showTasteSheet({ showSheet: true, type: "edit" })}
        />
      </YStack>
    </ScrollView>
  );
};
export default EditBeanPage;
