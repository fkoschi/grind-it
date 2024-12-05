import { beanTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Circle, Slider, Text, View } from "tamagui";

export const PATH_NAME = "/bean/edit/degree";

const EditDegree: FC = () => {
  const router = useRouter();
  const { db } = useDatabase();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [degreeValue, setDegreeValue] = useState<number[] | undefined>();

  const parsedValue = degreeValue ? degreeValue[0] / 10 : 0;

  const handleValueChange = (value: number[]) => {
    setDegreeValue(value);
  };

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
    fetchInitialData();
  }, []);

  useEffect(() => {
    const beforeRemove = navigation.addListener("beforeRemove", async (e) => {
      e.preventDefault();

      try {
        await db
          .update(beanTable)
          .set({ degreeOfGrinding: parsedValue })
          .where(eq(beanTable.id, Number(id)));

        navigation.dispatch(e.data.action);
      } catch (error) {
        console.error(error);
      }
    });
    return beforeRemove;
  }, [navigation, degreeValue]);

  return (
    <View flex={1}>
      <View flex={0} alignItems="center" mt="$10">
        <Text fontSize="$14" color="$primary" fontFamily="BlackMango-Regular">
          {parsedValue}
        </Text>
      </View>

      <View flex={1} alignItems="center" overflow="hidden" mt="$12">
        <Circle flex={1} justifyContent="flex-start" size={600} bgC="#E8E8E8">
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
        </Circle>
      </View>
    </View>
  );
};
export default EditDegree;
