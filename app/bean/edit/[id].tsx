import React, { FC } from "react";
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
  InputWithSuffix,
  LoadingScreen,
  Select as ThemedSelect,
  ThemedText,
} from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { Image } from "expo-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const PATH_NAME = "/bean/edit";

const schema = z.object({
  name: z.string().nonempty(),
  roastery: z.number(),
  arabicaAmount: z.number().min(0).max(100),
  robustaAmount: z.number().min(0).max(100),
  singleShotAmount: z.number().min(0),
  doubleShotAmount: z.number().min(0),
});

type Schema = z.infer<typeof schema>;

const EditBeanPage: FC = () => {
  const { db } = useDatabase();
  const {
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
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
        singleShotAmount: beanTable.singleShotAmount,
        doubleShotAmount: beanTable.doubleShotAmount,
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
  const handleArabicaAmountChange = async (amount: number) => {
    console.log(amount, errors);
    /* await db
      .update(beanTable)
      .set({ arabicaAmount: Number(amount) })
      .where(eq(beanTable.id, Number(beanId))); */
  };
  const handleRobustaAmountChange = async (amount: number) => {
    console.log(amount, typeof amount, errors);
    /* await db
      .update(beanTable)
      .set({ robustaAmount: Number(amount) })
      .where(eq(beanTable.id, Number(beanId))); */
  };
  const handleSingleShotAmountChange = async (amount: number) => {
    await db
      .update(beanTable)
      .set({ singleShotAmount: Number(amount) })
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
  const BeanArabicaRobustaInput = () => (
    <XStack gap="$4">
      <Label>Arabica / Robusta</Label>
      <XStack flex={1} gap="$2">
        <Controller
          name="arabicaAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithSuffix
              {...props}
              keyboardType="numeric"
              suffix={<PercentageIcon fillColor="#664F3F" />}
              onBlur={() => handleArabicaAmountChange(value)}
              onChangeText={(text: string) => onChange(parseInt(text))}
              defaultValue={beanData?.[0]?.arabicaAmount?.toString()}
            />
          )}
        />
        <Controller
          name="robustaAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithSuffix
              {...props}
              keyboardType="numeric"
              suffix={<PercentageIcon fillColor="#664F3F" />}
              onBlur={() => handleRobustaAmountChange(value)}
              onChangeText={(text: string) => {
                console.log(errors);
                onChange(text);
              }}
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
                  SelectProps={{
                    defaultValue: beanData?.[0]?.roastery?.toLowerCase() ?? "",
                  }}
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
  const BeansTasteInput = () => {
    return (
      <>
        <YStack gap="$1" mt="$2">
          <Text fontSize="$4">Geschmack</Text>
          {!beanTasteData.length && (
            <XStack flex={0} height="$8" justifyContent="center">
              <Image
                source={require("@/assets/images/latte-art.png")}
                style={{ width: 80, height: 80 }}
              />
            </XStack>
          )}
          <View flex={1} gap="$2" flexWrap="wrap" flexDirection="row" mt="$3">
            {beanTasteData.map(({ flavor }, index) => (
              <View key={index} flex={0}>
                <Badge title={flavor} />
              </View>
            ))}
          </View>
          <View flex={1} mt="$4">
            <Button
              mt="$2"
              bgC="$secondary"
              color="white"
              size="$3"
              onPress={() => showTasteSheet({ showSheet: true, type: "edit" })}
              pressStyle={{
                backgroundColor: "$secondary",
              }}
            >
              Geschmack bearbeiten
            </Button>
          </View>
        </YStack>
      </>
    );
  };
  const BeanShotAmountInput = () => (
    <XStack gap="$4">
      <Label>Single / Double Shot</Label>
      <XStack flex={1} gap="$2">
        <Controller
          name="singleShotAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithSuffix
              {...props}
              keyboardType="numeric"
              suffix={
                <ThemedText fw={500} lineHeight={12}>
                  g
                </ThemedText>
              }
              onBlur={() => handleSingleShotAmountChange(value)}
              onChangeText={(text: string) =>
                onChange(parseFloat(text.replace(/,/g, ".")))
              }
              defaultValue={beanData?.[0]?.singleShotAmount?.toString()}
            />
          )}
        />
        <Controller
          name="doubleShotAmount"
          control={control}
          render={({ field: { onChange, value }, ...props }) => (
            <InputWithSuffix
              {...props}
              keyboardType="numeric"
              suffix={
                <ThemedText fw={500} lineHeight={12}>
                  g
                </ThemedText>
              }
              onBlur={() => handleSingleShotAmountChange(value)}
              onChangeText={(text: string) =>
                onChange(parseFloat(text.replace(/,/g, ".")))
              }
            />
          )}
        />
      </XStack>
    </XStack>
  );

  if (beanData.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView flex={1} py="$6" px="$4">
      <YStack gap="$2">
        <BeanNameInput />
        <BeanRoasteryInput />
        <BeanArabicaRobustaInput />
        <BeanShotAmountInput />
        <BeansTasteInput />
      </YStack>
    </ScrollView>
  );
};
export default EditBeanPage;
