import { FC } from "react";
import { View } from "tamagui";
import { Image } from "expo-image";
import { ActionButton, EditIcon, Tabs } from "@/components/ui";
import { CoffeeBean } from "@/types";
import { DetailsPageInfoTab } from "./components/DetailsPage.InfoTab";
import { DetailsPageDetailsTab } from "./components/DetailsPage.DetailsTab";

interface Props {
  beansData: CoffeeBean;
  tastes: { flavor: string }[];
  onEditPress: () => void;
  onDegreePress: () => void;
}
const DetailsPageComponent: FC<Props> = ({
  beansData,
  tastes,
  onEditPress,
  onDegreePress,
}) => (
  <View flex={1}>
    <Image
      source={require("@/assets/images/coffee-cup.png")}
      style={{
        position: "absolute",
        zIndex: 1,
        top: -140,
        right: -20,
        width: 200,
        height: 200,
      }}
    />
    <Tabs defaultValue="info" width="100%">
      <Tabs.List marginHorizontal="$4">
        <Tabs.Trigger value="info">Info</Tabs.Trigger>
        <Tabs.Trigger value="details">Details</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="info">
        <DetailsPageInfoTab
          tastes={tastes}
          beansData={beansData}
          onDegreePress={onDegreePress}
        />
      </Tabs.Content>
      <Tabs.Content value="details">
        <DetailsPageDetailsTab />
      </Tabs.Content>
    </Tabs>

    <ActionButton
      bgC="$primary"
      onPress={onEditPress}
      pressStyle={{
        bgC: "$primaryHover",
      }}
      icon={<EditIcon />}
    />
  </View>
);

export default DetailsPageComponent;
