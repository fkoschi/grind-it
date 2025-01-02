import TabBar from "@/components/navigation/TabBar";
import { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Text, Circle, ListItem, styled, View, YGroup, Separator } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import ThemedText from "@/components/ui/ThemedText";

const SettingsPage: FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View alignItems="center" mt="$6">
        <Avatar circular size="$10">
          <Avatar.Image
            accessibilityLabel="Cam"
            src={require("@/assets/images/icon.png")}
          />
        </Avatar>
        <Text fontSize={24} fontFamily="BlackMango-Regular">Grind It</Text>
        <ThemedText fw={400}>v.0.1</ThemedText>
      </View>
      <YGroup mt="$4" p="$4" bordered>
        <YGroup.Item>
          <ListItem
            pressTheme
            bgC="#F7F7F7"
            iconAfter={ChevronRight}
            onPress={() => router.navigate("/roasteries/edit")}
          >
            Röstereien
          </ListItem>
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem
            pressTheme
            bgC="#F7F7F7"
            iconAfter={ChevronRight}
            onPress={() => router.navigate("/taste/edit")}
          >
            Geschmack
          </ListItem>
        </YGroup.Item>
      </YGroup>
      <TabBar />
    </SafeAreaView>
  );
};
export default SettingsPage;
