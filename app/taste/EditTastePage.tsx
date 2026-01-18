import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { Image } from "expo-image";
import React, { FC, useState } from "react";
import { Text, ScrollView, View, XGroup } from "tamagui";
import {
  AddIcon,
  ActionButton,
  Sheet as BottomSheet,
  Badge,
} from "@/components/ui";
import { eq } from "drizzle-orm";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import NoData from "@/components/NoData/NoData";
import { Taste } from "@/types";
import { AddTasteFrame } from "@/components";

interface EditTastePageProps {
  data: Taste[];
}
const EditTastePage: FC<EditTastePageProps> = ({ data }) => {
  const router = useRouter();
  const { db } = useDatabase();
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const deleteTaste = async (tasteId: number) => {
    await db
      .delete(beanTasteAssociationTable)
      .where(eq(beanTasteAssociationTable.tasteId, tasteId));

    await db.delete(beanTasteTable).where(eq(beanTasteTable.id, tasteId));
  };

  const DataView = () => (
    <ScrollView>
      <XGroup gap="$2">
        {data.map((taste) => (
          <View key={taste.flavor} alignSelf="flex-start" mb="$2">
            <Badge
              title={taste.flavor}
              withButton
              onPress={() => deleteTaste(taste.id)}
            />
          </View>
        ))}
      </XGroup>
    </ScrollView>
  );

  const noData = data.length === 0;
  const hasData = data.length > 0;

  return (
    <View flex={1}>
      <LinearGradient
        height={"$14"}
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
      >
        <View>
          <Pressable
            style={{ position: "sticky", top: 80, left: 32 }}
            onPress={() => router.back()}
          >
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 24, height: 24, tintColor: "white" }}
            />
          </Pressable>
        </View>
        <View flex={1} justifyContent="flex-end" alignItems="center">
          <Text fontSize={32} c={"$white"} fontFamily="$sodabery" mb="$6">
            Geschmack
          </Text>
        </View>
      </LinearGradient>
      <View flex={1} mt="$4" py="$6">
        {noData && (
          <NoData
            variant={2}
            headline="Keine Daten!"
            copy="Erstelle deinen ersten Geschmack"
          />
        )}
        {hasData && <DataView />}
        <View flex={0} style={{ position: "absolute", bottom: 0 }}>
          <ActionButton
            icon={<AddIcon />}
            onPress={() => setOpenSheet(true)}
            bgC="$primary"
            pressStyle={{ backgroundColor: "$primaryHover" }}
          />
        </View>
      </View>
      <BottomSheet
        sheetProps={{
          open: openSheet,
          animation: "medium",
          onOpenChange: (open: boolean) => setOpenSheet(open),
          dismissOnSnapToBottom: true,
        }}
        frame={
          <AddTasteFrame
            open={openSheet}
            onSave={() => setOpenSheet(false)}
            onCancel={() => setOpenSheet(false)}
          />
        }
      />
    </View>
  );
};

export default EditTastePage;
