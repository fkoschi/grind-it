import React, { ReactNode } from "react";
import { View, Text, styled, AnimatePresence, StackProps } from "tamagui";
import { useTabs } from "./TabsContext";

interface TabsTriggerProps extends StackProps {
  value: string;
  children: ReactNode;
}

const TriggerContainer = styled(View, {
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  cursor: "pointer",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
});

export const TabsTrigger = ({
  value,
  children,
  ...props
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <TriggerContainer onPress={() => setActiveTab(value)} {...props}>
      <Text
        fontFamily={
          isActive ? "DarkerGrotesque_500Medium" : "DarkerGrotesque_400Regular"
        }
        fontSize={16}
        color={isActive ? "$primary" : "$copyText"}
      >
        {children}
      </Text>
      <AnimatePresence>
        {isActive && (
          <View
            key="indicator"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.5 }}
            exitStyle={{ opacity: 0, scale: 0.5 }}
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={2}
            backgroundColor="$primary"
          />
        )}
      </AnimatePresence>
    </TriggerContainer>
  );
};
