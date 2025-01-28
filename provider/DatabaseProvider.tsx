import React, { createContext, FC, PropsWithChildren, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { View, Text } from "tamagui";
import LoadingScreen from "@/components/ui/Loading/LoadingScreen";

const expo = SQLite.openDatabaseSync("grind-it.db", {
  enableChangeListener: true, // enable useLiveQuery
});

const db = drizzle(expo);

interface DatabaseContextState {
  db: ExpoSQLiteDatabase;
}

const DatabaseContext = createContext<DatabaseContextState | undefined>(
  undefined,
);

export const DatabaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View flex={1} justifyContent="center">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return <LoadingScreen />;
  }

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
