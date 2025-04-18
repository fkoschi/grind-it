import { Alert, DeleteOutlinedIcon } from "@/components/ui";
import { beanTable } from "@/db/schema";
import { useIsBottomSheetActive } from "@/hooks/useIsBottomSheetActive";
import { useKeyboardIsVisible } from "@/hooks/useKeyboardIsVisible";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { eq } from "drizzle-orm";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { Button, View } from "tamagui";
import { useBeansData } from "@/hooks/useBensData";

export const BeanHeaderLayoutEdit = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();
  const fontSize = useSharedValue(48);

  const beansData = useBeansData();

  console.log(beansData);

  const handleDeleteBeanPress = async () => {
    await db.delete(beanTable).where(eq(beanTable.id, Number(beanId)));
    router.replace("/");
  };

  const isKeyboardVisible = useKeyboardIsVisible();
  const isBottomSheetActive = useIsBottomSheetActive();

  useEffect(() => {
    if (isKeyboardVisible && !isBottomSheetActive) {
      fontSize.value = withSpring(24, { damping: 20, stiffness: 90 });
    } else {
      fontSize.value = withSpring(48, { damping: 20, stiffness: 90 });
    }
  }, [isKeyboardVisible, fontSize, isBottomSheetActive]);

  return (
    <View flex={1}>
      <View position="absolute" right={32} top={44}>
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
      <View flex={1} justifyContent="flex-end" alignItems="center" mb="$6">
        <Animated.Text
          style={{ fontSize, fontFamily: "TBJSodabery-LightOriginal" }}
        >
          {beansData?.name}
        </Animated.Text>
      </View>
    </View>
  );
};
