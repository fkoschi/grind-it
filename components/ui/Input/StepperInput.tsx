import React, { FC, useState, useEffect } from "react";
import { View, Text, Input, XStack, Button } from "tamagui";
import { Minus, Plus } from "@tamagui/lucide-icons";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

const StepperInput: FC<StepperInputProps> = ({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 0.5,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    const num = parseFloat(inputValue);
    // Only update if the value has actually changed externally or is significantly different
    // to avoid overwriting "8." with "8" while typing
    if (isNaN(num) || Math.abs(num - value) > 0.0001) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Math.round(newValue * 10) / 10);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(Math.round(newValue * 10) / 10);
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    const num = parseFloat(text);
    if (!isNaN(num)) {
      onChange(Math.round(num * 10) / 10);
    } else if (text === "") {
      onChange(0); // Handle empty input
    }
  };

  return (
    <View flex={1}>
      <XStack alignItems="center" gap="$2">
        <Button
          size="$2"
          circular
          icon={Minus}
          onPress={handleDecrement}
          bgC="$secondary"
          color="white"
          disabled={value <= min}
          opacity={value <= min ? 0.5 : 1}
        />
        <View
          flex={1}
          bgC="white"
          borderRadius="$4"
          height={40}
          maxWidth={100}
          justifyContent="center"
        >
          <Input
            value={inputValue}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            textAlign="center"
            bgC="transparent"
            borderWidth={0}
            fontSize="$5"
            height="100%"
          />
        </View>
        <Button
          size="$2"
          circular
          icon={Plus}
          onPress={handleIncrement}
          bgC="$secondary"
          color="white"
          disabled={value >= max}
          opacity={value >= max ? 0.5 : 1}
        />
      </XStack>
      {label && (
        <View mt="$2" alignItems="center">
          <Text fontSize="$2">{label}</Text>
        </View>
      )}
    </View>
  );
};

export default StepperInput;
