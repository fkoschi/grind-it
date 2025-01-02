import { FC } from "react";
import { roasteryTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { ListItem, ScrollView, View, YGroup } from "tamagui";
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";
import { useDatabase } from "@/provider/DatabaseProvider";

const EditRoasteries: FC = () => {
  const { db } = useDatabase();
  const { data } = useLiveQuery(db.select().from(roasteryTable));

  const handleItemPress = async (id: number) => {
    await db.delete(roasteryTable).where(eq(roasteryTable.id, id));
  };

  return (
    <View flex={1} mt="$4" py="$6">
      <ScrollView>
        <YGroup mt="$4">
          {data.map((roastery, index) => (
            <YGroup.Item key={index}>
              <ListItem
                circular
                py="$4"
                onPress={() => handleItemPress(roastery.id)}
              >
                {roastery.name}
              </ListItem>
            </YGroup.Item>
          ))}
        </YGroup>
      </ScrollView>
    </View>
  );
};
export default EditRoasteries;
