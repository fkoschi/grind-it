import { beanTasteAssociationTable, beanTasteTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { FC, useState } from "react";
import {
  ListItem,
  Text,
  ScrollView,
  View,
  YGroup,
  Input,
  XStack,
  Button,
} from "tamagui";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import DeleteOutlinedIcon from "@/components/ui/Icons/DeleteOutlined";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import AddIcon from "@/components/ui/Icons/Add";
import { eq } from "drizzle-orm";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import { Controller, useForm } from "react-hook-form";

const BottomSheetFrame: FC = () => {
  const { control } = useForm();

  return (
    <View flex={1} p="$4">
      <XStack>
        <Controller
          name="taste"
          control={control}
          render={({ field }) => <Input flex={1} autoFocus {...field} />}
        />
        <Button>Click Me</Button>
      </XStack>
    </View>
  );
};

const EditTastePage: FC = () => {
  const { db } = useDatabase();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { data } = useLiveQuery(db.select().from(beanTasteTable));

  const deleteTaste = async (tasteId: number) => {
    await db
      .delete(beanTasteAssociationTable)
      .where(eq(beanTasteAssociationTable.tasteId, tasteId));

    await db.delete(beanTasteTable).where(eq(beanTasteTable, tasteId));
  };

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      console.log("prog.value ", prog.value);
      console.log("drag.value ", drag.value);
      return {
        width: Math.max(40, drag.value * -1), // Minimum width of 100, expands with drag
        backgroundColor: "#CD5B5B",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 8,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <View mr="$1">
          <DeleteOutlinedIcon size={18} color="white" />
        </View>
      </Reanimated.View>
    );
  };

  return (
    <>
      <View flex={1} mt="$4" py="$6">
        <ScrollView>
          <YGroup>
            {data.map((taste, index) => (
              <ReanimatedSwipeable renderRightActions={RightAction}>
                <YGroup.Item key={index}>
                  <ListItem style={{ height: 50 }}>
                    <Text>{taste.flavor}</Text>
                  </ListItem>
                </YGroup.Item>
              </ReanimatedSwipeable>
            ))}
          </YGroup>
        </ScrollView>
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
          onOpenChange: (open: boolean) => setOpenSheet(open),
          dismissOnSnapToBottom: true,
        }}
        frame={<BottomSheetFrame />}
      />
    </>
  );
};

export default EditTastePage;
