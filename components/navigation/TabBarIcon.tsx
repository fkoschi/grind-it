import { FC, ReactElement } from "react";
import { View } from "tamagui";
import { HapticTab } from "../HapticTab";

interface Props {
  onPress: () => void;
  icon: ReactElement;
}
const TabBarIcon: FC<Props> = ({ onPress, icon }) => {
  return (
    <View flex={1} alignItems="center">
      <HapticTab
        style={{
          flex: 1,
          zIndex: 999999,
          maxHeight: 60,
          width: 80,
          alignItems: "center",
          justifyContent: "center"
        }}
        onPress={onPress}
      >
        {icon}
      </HapticTab>
    </View>
  );
};

export default TabBarIcon;
