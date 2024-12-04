import { FC } from "react";
import { roasteryTable } from "@/db/schema";
import { db } from "@/services/db-service";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ListItem, ScrollView, Text, View, YGroup } from "tamagui";
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";

const EditRoasteries: FC = () => {
  const router = useRouter();
  const { data } = useLiveQuery(db.select().from(roasteryTable));

  const handleItemPress = async (id: number) => {
    await db.delete(roasteryTable).where(eq(roasteryTable.id, id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        position="absolute"
        top={72}
        left={16}
        onPress={() => router.back()}
      >
        <ChevronLeft />
      </Button>
      <View flex={1} mt="$12" py="$8">
        <Text fontSize="$8">Röstereien</Text>
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
    </SafeAreaView>
  );
};
export default EditRoasteries;
