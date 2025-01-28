import { beanTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";
import { FC, useCallback, useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Circle, Slider, Text, View } from "tamagui";
import * as Haptics from "expo-haptics";

export const PATH_NAME = "/bean/edit/degree";
const CIRCEL_SIZE = 600;

const EditDegree: FC = () => {
  const { db } = useDatabase();
  const { id } = useLocalSearchParams();

  const rotation = useSharedValue(0);

  const [degreeValue, setDegreeValue] = useState<number[] | undefined>();
  const parsedValue = degreeValue ? degreeValue[0] / 10 : 0;

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleValueChange = async (value: number[]) => {
    const prev = degreeValue?.[0];
    const curr = value[0];

    if (prev !== undefined && prev !== curr) {
      rotation.value = withSpring(rotation.value + (curr - prev) * 9);
      Haptics.selectionAsync();
    }

    await db
      .update(beanTable)
      .set({ degreeOfGrinding: parsedValue })
      .where(eq(beanTable.id, Number(id)));

    setDegreeValue(value);
  };

  const resetRotationValue = useCallback(
    () => (rotation.value = 0),
    [rotation],
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      const dbResult = await db
        .select({ degreeOfGrinding: beanTable.degreeOfGrinding })
        .from(beanTable)
        .where(eq(beanTable.id, Number(id)));

      const degreeOfGrinding = dbResult[0].degreeOfGrinding;
      if (degreeOfGrinding) {
        const parsedValue = degreeOfGrinding * 10;
        setDegreeValue([parsedValue]);
      }
    };
    resetRotationValue();
    fetchInitialData();
  }, [db, id, resetRotationValue]);

  return (
    <View flex={1}>
      <View flex={1} alignItems="center" mt="$10">
        <Text
          fontSize={140}
          color="$primary"
          fontFamily="TBJSodabery-LightOriginal"
        >
          {parsedValue}
        </Text>
      </View>

      <View flex={1} alignItems="center" overflow="hidden" pt="$4">
        <Circle
          flex={1}
          justifyContent="flex-start"
          size={CIRCEL_SIZE}
          bgC="#E8E8E8"
        >
          <Slider
            size="$2"
            width="$16"
            height="$8"
            max={100}
            step={1}
            mt="$11"
            value={degreeValue}
            onValueChange={handleValueChange}
          >
            <Slider.Track>
              <Slider.TrackActive backgroundColor="$primary" />
            </Slider.Track>
            <Slider.Thumb
              circular
              backgroundColor="$primary"
              borderColor="white"
              index={0}
            />
          </Slider>
          <Animated.Image
            source={require("@/assets/images/cogwheel-layer.png")}
            style={[
              {
                position: "absolute",
                bottom: 20,
                zIndex: -1,
                width: CIRCEL_SIZE,
                height: CIRCEL_SIZE,
              },
              animatedStyles,
            ]}
          />
        </Circle>
      </View>
    </View>
  );
};
export default EditDegree;
