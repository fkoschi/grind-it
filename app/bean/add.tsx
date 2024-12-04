import ActionButton from "@/components/ui/ActionButton/ActionButton";
import AddIcon from "@/components/ui/Icons/Add";
import CheckIcon from "@/components/ui/Icons/Check";
import PercentageIcon from "@/components/ui/Icons/Percentage";
import InputWithIcon from "@/components/ui/Input/InputWithIcon";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";
import { db } from "@/services/db-service";
import { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { Text, Input, View, XStack, Button } from "tamagui";
import { useBeanStore } from "@/store/bean-store";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import Badge from "@/components/ui/Badge/Badge";
import ThemedSelect from "@/components/ui/Select/Select";

interface FormInput {
  name: string;
  roastery: number;
  arabicaAmount: number;
  robustaAmount: number;
}

const AddBeanPage: FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const beanTaste = useBeanStore((state) => state.taste);
  const resetBeanState = useBeanStore((state) => state.clearBeanTaste);
  const removeBeanTaste = useBeanStore((state) => state.removeBeanTaste);
  const updateEditRoastery = useBeanStore((state) => state.updateEditRoastery);
  const updateEditBeanTaste = useBeanStore(
    (state) => state.updateEditBeanTaste
  );

  const { data: roasteries } = useLiveQuery(db.select().from(roasteryTable));

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
    const beanId = await db
      .insert(beanTable)
      .values({
        name: data.name,
        robustaAmount: data.robustaAmount,
        arabicaAmount: data.arabicaAmount,
        roastery: data.roastery,
      })
      .returning({ id: beanTable.id });

    const insertTasteValues = beanTaste.map((taste: string) => ({
      flavor: taste,
    }));
    const tasteIds = await db
      .insert(beanTasteTable)
      .values(insertTasteValues)
      .returning({ id: beanTasteTable.id });

    const insertAssociationValues = tasteIds.map((taste) => ({
      beanId: beanId[0].id,
      tasteId: taste.id,
    }));

    await db.insert(beanTasteAssociationTable).values(insertAssociationValues);

    router.navigate("/");
  };

  useEffect(() => {
    const beforeRemove = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      // If all has been cleaned up ...
      navigation.dispatch(e.data.action);
    });
    return beforeRemove;
  }, [navigation]);

  useEffect(() => {
    resetBeanState();
  }, []);

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
          gap="$4"
        >
          <View flex={1}>
            <Controller
              name="roastery"
              control={control}
              render={({ field, ...props }) => (
                <ThemedSelect
                  label="Rösterei"
                  items={roasteries}
                  onChange={field.onChange}
                  {...props}
                />
              )}
            />
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

        <View flex={0} mt="$4">
          <Text fontSize="$6">Geschmack</Text>
          {beanTaste && (
            <View
              flex={0}
              flexDirection="row"
              gap="$2"
              pt="$3"
              flexWrap="wrap"
              mb="$4"
            >
              {beanTaste.map((taste, index) => (
                <Badge
                  key={`bean-badge-${taste}-${index}`}
                  title={taste}
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
              onPress={() => updateEditBeanTaste(true)}
              pressStyle={{
                backgroundColor: "$secondary",
              }}
            >
              Neuen Geschmack hinzufügen
            </Button>
          </View>
        </View>
        <ActionButton
          bgC="#7AA996"
          onPress={handleSubmit(onSubmit)}
          icon={<CheckIcon />}
          pressStyle={{ bgC: "$primaryGreen" }}
        />
      </View>
    </View>
  );
};

export default AddBeanPage;
