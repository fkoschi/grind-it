import React, { useState, ReactNode } from "react";
import { YStack, StackProps } from "tamagui";
import { TabsContext } from "./TabsContext";
import { TabsList } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";
import { TabsContent } from "./TabsContent";

interface TabsProps extends StackProps {
  defaultValue: string;
  children: ReactNode;
  onValueChange?: (value: string) => void;
}

const TabsRoot = ({
  defaultValue,
  children,
  onValueChange,
  ...props
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab: handleValueChange }}
    >
      <YStack {...props}>{children}</YStack>
    </TabsContext.Provider>
  );
};

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
