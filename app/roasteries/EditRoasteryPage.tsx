import { FC, useState } from "react";
import { roasteryTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, ListItem, ScrollView, View, YGroup } from "tamagui";
import { eq } from "drizzle-orm";
import { Image } from "expo-image";
import { useDatabase } from "@/provider/DatabaseProvider";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import NoData from "@/components/NoData/NoData";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  ActionButton,
  AddIcon,
  DeleteOutlinedIcon,
  Sheet as BottomSheet,
} from "@/components/ui";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { HapticTab } from "@/components/ui/HapticTab/HapticTab";

import { AddRoasteryFrame } from "@/components";

const EditRoasteries: FC = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { data } = useLiveQuery(db.select().from(roasteryTable));

  const handleDelete = async (id: number) => {
    await db.delete(roasteryTable).where(eq(roasteryTable.id, id));
  };

  const Header = () => (
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
          Röstereien
        </Text>
      </View>
    </LinearGradient>
  );

  const RightAction = (drag: SharedValue<number>, roasteryId: number) => {
    const animatedStyle = useAnimatedStyle(() => ({
      width: Math.max(40, drag.value * -1),
      backgroundColor: "#CD5B5B",
      justifyContent: "center",
      alignItems: "flex-end",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    }));

    return (
      <Reanimated.View style={animatedStyle}>
        <HapticTab
          mr="$1"
          onPress={() => handleDelete(roasteryId)}
          style={{ padding: 8 }}
        >
          <DeleteOutlinedIcon size={18} color="white" />
        </HapticTab>
      </Reanimated.View>
    );
  };

  const DataView = () => (
    <ScrollView>
      <YGroup>
        {data.map((roastery, index) => (
          <ReanimatedSwipeable
            key={index}
            renderRightActions={(prog, drag) => RightAction(drag, roastery.id)}
          >
            <YGroup.Item>
              <ListItem circular py="$4">
                {roastery.name}
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
      <Header />
      <View flex={1} mt="$4" py="$6">
        {noData && (
          <NoData
            variant={3}
            headline="Keine Daten!"
            copy="Erstelle deine erste Rösterei"
          />
        )}
        {hasData && <DataView />}
      </View>
      <View flex={0} style={{ position: "absolute", bottom: 0 }}>
        <ActionButton
          bgC="$primary"
          icon={<AddIcon />}
          onPress={() => setOpenSheet(true)}
          pressStyle={{ backgroundColor: "$primaryHover" }}
        />
      </View>
      <BottomSheet
        sheetProps={{
          open: openSheet,
          onOpenChange: (open: boolean) => setOpenSheet(open),
          dismissOnSnapToBottom: true,
        }}
        frame={
          <AddRoasteryFrame
            open={openSheet}
            onFormSubmit={() => setOpenSheet(false)}
          />
        }
      />
    </View>
  );
};
export default EditRoasteries;
