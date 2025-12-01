import React, { ReactNode } from "react";
import { StackProps, AnimatePresence, View } from "tamagui";
import { useTabs } from "./TabsContext";

interface TabsContentProps extends StackProps {
  value: string;
  children: ReactNode;
}

export const TabsContent = ({
  value,
  children,
  ...props
}: TabsContentProps) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <AnimatePresence>
      {isActive && <View marginHorizontal="$4">{children}</View>}
    </AnimatePresence>
  );
};
