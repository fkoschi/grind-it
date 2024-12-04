import { useRouter } from "expo-router";
import { FC, useState } from "react";
import { Circle, Slider, Text, View } from "tamagui";

export const PATH_NAME = '/bean/edit/degree';

const EditDegree: FC = () => {
  const router = useRouter();
  const [degreeValue, setDegreeValue] = useState<number[]>([5]);

  const handleValueChange = (value: number[]) => {

    console.log(value);
    /* setDegreeValue(value); */
  };

  return (
    <View flex={1}>

      <View flex={0} alignItems="center" mt="$10">
        <Text fontSize="$14" color="$primary" fontFamily="BlackMango-Regular">
          {degreeValue[0]}
        </Text>
      </View>

      <View flex={1} alignItems="center" overflow="hidden" mt="$12">
        <Circle flex={1} justifyContent="flex-start" size={600} bgC="#E8E8E8">
          <Slider
            size="$2"
            width="$16"
            height="$8"
            defaultValue={degreeValue}
            max={10}
            step={0.1}
            mt="$11"
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
