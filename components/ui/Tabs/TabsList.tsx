import React, { ReactNode } from "react";
import { XStack, StackProps } from "tamagui";

interface TabsListProps extends StackProps {
  children: ReactNode;
}

export const TabsList = ({ children, ...props }: TabsListProps) => {
  return <XStack {...props}>{children}</XStack>;
};
