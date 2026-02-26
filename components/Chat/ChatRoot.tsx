import { YStack, YStackProps } from "tamagui";

export const ChatRoot = ({ children, ...props }: YStackProps) => {
  return (
    <YStack flex={1} {...props}>
      {children}
    </YStack>
  );
};
