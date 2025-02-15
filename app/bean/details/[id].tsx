import { FC } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { Image } from "expo-image";
import { ThemedText, Badge, ActionButton, EditIcon } from "@/components/ui";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";
import { Pressable } from "react-native";

export const PATH_NAME = "/bean/details";

const DetailsPage: FC = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();

  const { data } = useLiveQuery(
    db
      .select({
        roastery: roasteryTable.name,
        beanName: beanTable.name,
        robustaAmount: beanTable.robustaAmount,
        arabicaAmount: beanTable.arabicaAmount,
        singleShotAmount: beanTable.singleShotAmount,
        doubleShotAmount: beanTable.doubleShotAmount,
        degreeOfGrinding: beanTable.degreeOfGrinding,
      })
      .from(beanTable)
      .leftJoin(roasteryTable, eq(beanTable.roastery, roasteryTable.id))
      .where(eq(beanTable.id, Number(id)))
  );

  const fetchTasteByBeanId = async () => {
    const tasteIdData = await db
      .select({
        tasteId: beanTasteAssociationTable.tasteId,
      })
      .from(beanTasteAssociationTable)
      .where(eq(beanTasteAssociationTable.beanId, Number(id)));

    const tasteIds = tasteIdData.map((taste) => taste.tasteId);

    const tasteData = await db
      .select({ flavor: beanTasteTable.flavor })
      .from(beanTasteTable)
      .where(inArray(beanTasteTable.id, tasteIds));

    return tasteData;
  };

  if (!data.length) {
    return null;
  }

  const {
    roastery,
    beanName,
    robustaAmount,
    arabicaAmount,
    degreeOfGrinding,
    singleShotAmount,
    doubleShotAmount,
  } = data[0];

  const renderTaste = async () => {
    const tastes = await fetchTasteByBeanId();

    return tastes.map((taste, index) => (
      <Badge key={`bean-details-flavor-${index}`} title={taste.flavor} />
    ));
  };

  const handleEditPress = () => router.navigate(`/bean/edit/${id}`);
  const handleDegreePress = () => router.navigate(`/bean/edit/degree/${id}`);

  return (
    <View flex={1}>
      <View flex={0}>
        <Image
          source={require("@/assets/images/coffee-cup.png")}
          style={{
            position: "absolute",
            zIndex: 1,
            top: -140,
            right: -20,
            width: 200,
            height: 200,
          }}
        />
      </View>
      <View flex={1} p="$6">
        <ThemedText fontSize="$6" color="$primary" fw={500}>
          {roastery}
        </ThemedText>
        <Text fontSize="$11" mt="$2" fontFamily="TBJSodabery-LightOriginal">
          {beanName}
        </Text>
        <View flex={0} mt="$2"></View>

        <XStack gap={8} flex={0} justifyContent="space-between">
          <YStack>
            <ThemedText fw={600} fontSize={18}>
              {`${arabicaAmount ? arabicaAmount : 0} %`}
            </ThemedText>
            <ThemedText fw={400}>Arabica</ThemedText>
          </YStack>
          <YStack>
            <ThemedText fw={600} fontSize={18}>
              {`${robustaAmount ? robustaAmount : 0} %`}
            </ThemedText>
            <ThemedText fw={400}>Robusta</ThemedText>
          </YStack>
          <YStack>
            <ThemedText fw={600} fontSize={18}>
              {`${singleShotAmount ? singleShotAmount : "0"} g`}
            </ThemedText>
            <ThemedText fw={400}>Single Shot</ThemedText>
          </YStack>
          <YStack>
            <ThemedText fw={600} fontSize={18}>
            {`${doubleShotAmount ? doubleShotAmount : "0"} g`}
            </ThemedText>
            <ThemedText fw={400}>Double Shot</ThemedText>
          </YStack>
        </XStack>

        <View flex={1} mt="$4">
          <View>
            <ThemedText fw={800} mb="$2">
              Geschmack
            </ThemedText>
            <View
              flex={0}
              flexWrap="wrap"
              flexDirection="row"
              gap={4}
              rowGap={6}
            >
              {renderTaste()}
            </View>
          </View>
          <View mt="$4">
            <ThemedText fw={800} mb="$2">
              Mahlgrad
            </ThemedText>
            <Pressable onPress={handleDegreePress}>
              <Text
                fontSize="$16"
                lineHeight="$16"
                color="$primary"
                fontFamily="TBJSodabery-LightOriginal"
              >
                {degreeOfGrinding ?? 0}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ActionButton
        bgC="$primary"
        onPress={handleEditPress}
        pressStyle={{
          bgC: "$primaryHover",
        }}
        icon={<EditIcon />}
      />
    </View>
  );
};
export default DetailsPage;
