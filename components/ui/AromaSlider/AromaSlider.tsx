import { FC } from "react";
import { Slider, Text, YStack, XStack } from "tamagui";

interface AromaSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const AromaSlider: FC<AromaSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 10,
}) => {
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <YStack gap="$2" flex={1}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$4" fontWeight="600" color="$copyText">
          {label}
        </Text>
        <Text fontSize="$3" color="$secondary" fontWeight="bold">
          {value}
        </Text>
      </XStack>
      <Slider
        size="$2"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
      >
        <Slider.Track backgroundColor="$gray200">
          <Slider.TrackActive backgroundColor="$primary" />
        </Slider.Track>
        <Slider.Thumb
          circular
          size="$1"
          backgroundColor="$primary"
          borderColor="white"
          borderWidth={2}
          index={0}
        />
      </Slider>
    </YStack>
  );
};

export default AromaSlider;
