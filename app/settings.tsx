import TabBar from "@/components/navigation/TabBar";
import { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "tamagui";

const SettingsPage: FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Settings Page</Text>
      </View>
      <TabBar />
    </SafeAreaView>
  );
};
export default SettingsPage;
