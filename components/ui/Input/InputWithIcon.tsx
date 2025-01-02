import { FC, ReactElement } from "react";
import { TextInputProps } from "react-native";
import { Text, Input, Label, View, XStack, YStack } from "tamagui";

interface Props extends TextInputProps {
  label?: string;
  suffix?: ReactElement;
}
const InputWithIcon: FC<Props> = ({ label, suffix, ...other }) => {
  return (
    <View flex={1}>
      <XStack
        flex={1}
        justifyContent="flex-start"
        alignItems="center"
        bgC="white"
        borderRadius="$4"
        overflow="hidden"
      >
        <View flex={1}>
          <Input
            flex={1}
            bgC="white"
            borderWidth={0}
            height={40}
            {...other}
          />
        </View>
        <View
          height={40}
          bgC="white"
          alignItems="center"
          justifyContent="center"
        >
          <View flex={0} width={12} height={12} bgC="white" mr="$3">
            {suffix}
          </View>
        </View>
      </XStack>
      {label && (
        <View mt="$2" flex={0} alignItems="flex-start">
          <Text fontSize="$2">{label}</Text>
        </View>
      )}
    </View>
  );
};

export default InputWithIcon;
