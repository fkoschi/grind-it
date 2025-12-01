import { ImageBackground } from "react-native";
import { FC } from "react";
import { Button, View } from "tamagui";
import { useRouter } from "expo-router";
import { useIsRouteActive } from "@/hooks/useIsRouteActive";
import HomeIcon from "../ui/Icons/Home";
import ProfileIcon from "../ui/Icons/Profile";
import AddIcon from "../ui/Icons/Add";
import TabBarIcon from "./TabBarIcon";

const TabBar: FC = () => {
  const router = useRouter();

  return (
    <View
      flexDirection="column"
      position="absolute"
      height={92}
      bottom={0}
      width="100%"
      zIndex={1_000}
    >
      <View
        position="absolute"
        height={92}
        alignItems="center"
        justifyContent="center"
        zIndex={100_000}
        bottom={40}
        width="100%"
      >
        <Button
          circular
          bgC={"#664F3F"}
          flex={1}
          onPress={() => router.navigate("/bean/add")}
          pressStyle={{ bgC: "$secondaryHover" }}
        >
          <AddIcon />
        </Button>
      </View>
      <ImageBackground
        source={require("@/assets/images/tab-bar.png")}
        style={{ flex: 1, justifyContent: "center", width: "100%" }}
        resizeMode="cover"
      >
        <View
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <TabBarIcon
            onPress={() => router.replace("/")}
            icon={<HomeIcon active={useIsRouteActive("/")} />}
          />
          <TabBarIcon
            icon={<ProfileIcon active={useIsRouteActive("/settings")} />}
            onPress={() => router.replace("/settings")}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default TabBar;
