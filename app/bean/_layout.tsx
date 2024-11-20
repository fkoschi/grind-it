import { Slot, useNavigation, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Button, View, Text, PortalProvider } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import { useEffect } from "react";
import DeleteOutlinedIcon from "@/components/ui/Icons/DeleteOutlined";
import { useLocalSearchParams, useRouteInfo } from "expo-router/build/hooks";
import Alert from "@/components/ui/Alert/Alert";
import { db } from "@/services/db-service";
import { beanTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import ThemedText from "@/components/ui/ThemedText";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import Bean from "./Bean";

const BeanLayout = () => {
  const router = useRouter();
  const routerInfo = useRouteInfo();
  const navigation = useNavigation();
  const { id: beanId } = useLocalSearchParams();

  const isEditRoute = routerInfo.pathname.includes("edit");
  const isAddRoute = routerInfo.pathname.includes("add");

  const handleDeleteBeanPress = async () => {
    await db.delete(beanTable).where(eq(beanTable.id, Number(beanId)));
    router.replace("/");
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Bean>
      <View flex={1}>
        <LinearGradient
          height="$20"
          colors={["#FFDAAB", "#E89E3F"]}
          borderBottomLeftRadius="$12"
          borderBottomRightRadius="$12"
          start={[0, 1]}
          end={[0, 0]}
        >
          <Pressable
            style={{ position: "absolute", top: 80, left: 32 }}
            onPress={() => router.back()}
          >
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 24, height: 24 }}
            />
          </Pressable>

          {isAddRoute && (
            <View
              flex={1}
              position="absolute"
              bottom={40}
              alignItems="center"
              width="100%"
            >
              <Text fontSize="$8">Neue Bohne</Text>
              <ThemedText fw={400} mt="$2">
                Erstellen Sie eine neue Bohne.
              </ThemedText>
            </View>
          )}

          {isEditRoute && (
            <View position="absolute" right={32} top={72}>
              <Alert
                title="Bohne löschen"
                cancelTitle="Abbrechen"
                actionTitle="Löschen"
                description="Soll die Bohne endgültig gelöscht werden?"
                onActionPress={handleDeleteBeanPress}
                alertTrigger={
                  <Button
                    flex={1}
                    bgC={"rgba(255, 255, 255, 0.2)"}
                    borderRadius="$radius.9"
                    p="$3"
                  >
                    <DeleteOutlinedIcon size={16} color="#CD5B5B" />
                  </Button>
                }
              />
            </View>
          )}
        </LinearGradient>
        <Slot />
      </View>
    </Bean>
  );
};

export default BeanLayout;
