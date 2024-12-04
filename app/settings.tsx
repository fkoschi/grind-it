import TabBar from "@/components/navigation/TabBar";
import { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Circle, ListItem, styled, View, YGroup } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

const SettingsPage: FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View alignItems="center" mt="$6">
        <Avatar circular size="$10">
          <Avatar.Image
            accessibilityLabel="Cam"
            src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
          />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
      </View>
      <YGroup mt="$8" p="$4" bordered>
        <YGroup.Item>
          <ListItem
            pressTheme
            bgC="#F7F7F7"
            iconAfter={ChevronRight}
            onPress={() => router.navigate("/edit/roasteries")}
          >
            Röstereien
          </ListItem>
        </YGroup.Item>
      </YGroup>
      <TabBar />
    </SafeAreaView>
  );
};
export default SettingsPage;
