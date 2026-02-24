import { machineTable, grinderTable, MachineType } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export const useEquipmentData = () => {
  const { db } = useDatabase();

  const { data: machineData } = useLiveQuery(db.select().from(machineTable));
  const { data: grinderData } = useLiveQuery(db.select().from(grinderTable));

  return { machine: machineData?.[0], grinder: grinderData?.[0] };
};

export const ESPRESSO_TYPES = [
  { value: MachineType.MANUAL_LEVER, label: "Manual Lever" },
  { value: MachineType.SPRING_LEVER, label: "Spring Lever" },
  { value: MachineType.SEMI_AUTOMATIC, label: "Semi-Automatic" },
  { value: MachineType.AUTOMATIC, label: "Automatic" },
  { value: MachineType.SUPER_AUTOMATIC, label: "Super-Automatic" },
  { value: MachineType.CAPSULE_POD, label: "Capsule / Pod" },
];

export const FILTER_TYPES = [
  { value: MachineType.MOKA_POT, label: "Moka Pot" },
  { value: MachineType.POUR_OVER, label: "Pour Over" },
  { value: MachineType.FRENCH_PRESS, label: "French Press" },
  { value: MachineType.AEROPRESS, label: "AeroPress" },
  { value: MachineType.SIPHON, label: "Siphon" },
  { value: MachineType.COLD_BREW, label: "Cold Brew" },
  { value: MachineType.TURKISH, label: "Turkish" },
];

export const OTHER_TYPES = [{ value: MachineType.OTHER, label: "Other" }];
