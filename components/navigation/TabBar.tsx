import { Dimensions, ImageBackground } from "react-native";
import { FC } from "react";
import { Button, View } from "tamagui";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import TabBarIcon from "./TabBarIcon";
import { useIsRouteActive } from "@/hooks/useIsRouteActive";
import HomeIcon from "../ui/Icons/Home";
import ProfileIcon from "../ui/Icons/Profile";

const TabBar: FC = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      flex={1}
      flexDirection="column"
      position="absolute"
      height={92}
      bottom={0}
      zIndex={999}
    >
      <View
        style={{
          position: "absolute",
          height: 92,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999999,
          bottom: 40,
          width: screenWidth,
        }}
      >
        <Button
          circular
          style={{ backgroundColor: "#664F3F", flex: 1 }}
          onPress={() => router.navigate("/bean/add")}
        >
          <Image
            source={require("@/assets/icons/add.png")}
            style={{ height: 24, width: 24 }}
          />
        </Button>
      </View>
      <ImageBackground
        source={require("@/assets/images/tab-bar.png")}
        style={{ flex: 1, justifyContent: "center", width: screenWidth }}
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
