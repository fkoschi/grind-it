import { FC, useState } from "react";
import { View } from "tamagui";
import { Image } from "expo-image";
import { ActionButton, EditIcon, Tabs } from "@/components/ui";
import { CoffeeBean } from "@/types";
import { DetailsPageInfoTab } from "./components/DetailsPage.InfoTab";
import { DetailsPageDetailsTab } from "./components/DetailsPage.DetailsTab";
import { useIsProUser } from "@/hooks/useIsProUser";
import { useTranslation } from "react-i18next";

interface Props {
  beansData: CoffeeBean;
  tastes: { flavor: string }[];
  onEditPress: () => void;
  onDegreePress: () => void;
  onAromaEditPress: () => void;
  onAromaInfoPress: () => void;
}
const DetailsPageComponent: FC<Props> = ({
  beansData,
  tastes,
  onEditPress,
  onDegreePress,
  onAromaEditPress,
  onAromaInfoPress,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"info" | "details">("info");
  const isProUser = useIsProUser();

  // Determine which action the floating button should trigger
  const handleActionPress = () => {
    if (activeTab === "details") {
      onAromaEditPress();
    } else {
      onEditPress();
    }
  };

  const hideActionButton = activeTab === "details" && !isProUser;

  return (
    <View flex={1}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          top: -140,
          right: -20,
          width: 200,
          height: 200,
        }}
        pointerEvents="none"
      >
        <Image
          source={
            beansData.isFavorite
              ? require("@/assets/images/coffee-cup-favorite.png")
              : require("@/assets/images/coffee-cup.png")
          }
          style={{ width: 200, height: 200 }}
        />
      </View>
      <Tabs
        defaultValue="info"
        flex={1}
        width="100%"
        onValueChange={(value) => setActiveTab(value as "info" | "details")}
      >
        <Tabs.List marginHorizontal="$4">
          <Tabs.Trigger value="info">{t("details.tabs.info")}</Tabs.Trigger>
          <Tabs.Trigger value="details">{t("details.tabs.aromaWheel")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">
          <DetailsPageInfoTab tastes={tastes} beansData={beansData} onDegreePress={onDegreePress} />
        </Tabs.Content>
        <Tabs.Content value="details">
          <DetailsPageDetailsTab beansData={beansData} onInfoPress={onAromaInfoPress} />
        </Tabs.Content>
      </Tabs>

      {!hideActionButton && (
        <ActionButton
          bgC="$primary"
          onPress={handleActionPress}
          pressStyle={{
            bgC: "$primaryHover",
          }}
          icon={<EditIcon />}
        />
      )}
    </View>
  );
};

export default DetailsPageComponent;
