import { createContext, useContext } from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined,
);

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a Tabs provider");
  }
  return context;
};
