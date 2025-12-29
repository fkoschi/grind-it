import React, { createContext, FC, PropsWithChildren, useContext } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDatabase } from "./DatabaseProvider";
import { beanTable } from "@/db/schema";

interface BeanDataContextState {
  allBeans?: { id: number }[];
}

const BeanDataContext = createContext<BeanDataContextState | undefined>(
  undefined,
);

export const BeanDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { db } = useDatabase();

  // Query all beans once at the provider level - persists across routes
  const { data: allBeans } = useLiveQuery(
    db.select({ id: beanTable.id }).from(beanTable),
  );

  return (
    <BeanDataContext.Provider value={{ allBeans }}>
      {children}
    </BeanDataContext.Provider>
  );
};

export const useBeanData = (): BeanDataContextState => {
  const context = useContext(BeanDataContext);
  if (!context) {
    throw new Error("useBeanData must be used within BeanDataProvider");
  }
  return context;
};
