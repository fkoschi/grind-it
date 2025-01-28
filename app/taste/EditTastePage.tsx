import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { Image } from "expo-image";
import React, { FC, useState } from "react";
import { ListItem, Text, ScrollView, View, YGroup } from "tamagui";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  AddIcon,
  ActionButton,
  DeleteOutlinedIcon,
  Sheet as BottomSheet,
} from "@/components/ui";
import { eq } from "drizzle-orm";
import { HapticTab } from "@/components/ui/HapticTab/HapticTab";
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

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    tasteId: number,
    index: number,
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        width: Math.max(40, drag.value * -1), // Minimum width of 100, expands with drag
        backgroundColor: "#CD5B5B",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 8,
        borderTopRightRadius: index === 0 ? 12 : 0,
        borderBottomRightRadius: index === data.length - 1 ? 12 : 0,
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <HapticTab mr="$1" onPress={() => deleteTaste(tasteId)}>
          <DeleteOutlinedIcon size={18} color="white" />
        </HapticTab>
      </Reanimated.View>
    );
  };

  const DataView = () => (
    <ScrollView>
      <YGroup>
        {data.map((taste, index) => (
          <ReanimatedSwipeable
            renderRightActions={(prog, drag) =>
              RightAction(prog, drag, taste.id, index)
            }
            key={index}
          >
            <YGroup.Item>
              <ListItem circular py="$4">
                <Text>{taste.flavor}</Text>
              </ListItem>
            </YGroup.Item>
          </ReanimatedSwipeable>
        ))}
      </YGroup>
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
          <Text
            fontSize={32}
            c={"$white"}
            fontFamily="TBJSodabery-LightOriginal"
            mb="$6"
          >
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
