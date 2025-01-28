import { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Text, ListItem, View, YGroup, Separator } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import TabBar from "@/components/Navigation/TabBar";
import { ThemedText } from "@/components/ui";

import { version } from "../package.json";

const SettingsPage: FC = () => {
  const router = useRouter();

  return (
    <View bgC={"$screenBackground"} flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <View alignItems="center" mt="$6">
          <Avatar circular size="$10">
            <Avatar.Image
              accessibilityLabel="Grind It Logo"
              src={require("@/assets/images/icon.png")}
            />
          </Avatar>
          <Text fontSize={24} fontFamily="TBJSodabery-LightOriginal">
            Grind It
          </Text>
          <ThemedText fw={400}>v.{version}</ThemedText>
        </View>
        <YGroup mt="$4" p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/roasteries/EditRoasteryPage")}
            >
              Röstereien
            </ListItem>
          </YGroup.Item>
          <Separator />
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/taste/EditTasteComponent")}
            >
              Geschmack
            </ListItem>
          </YGroup.Item>
        </YGroup>
        <TabBar />
      </SafeAreaView>
    </View>
  );
};
export default SettingsPage;
