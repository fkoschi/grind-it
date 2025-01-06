import { useBeanStore } from "@/store/bean-store";
import { useEffect, useState } from "react";

export const useIsBottomSheetActive = (): boolean => {
  const [isBottomSheetActive, setIsBottomSheetActive] =
    useState<boolean>(false);

  const editBeanTaste = useBeanStore((state) => state.editBeanTaste);
  const editRoastery = useBeanStore((state) => state.editRoastery);

  useEffect(() => {
    setIsBottomSheetActive(editBeanTaste.showSheet || editRoastery);
  }, [editBeanTaste, editRoastery]);

  return isBottomSheetActive;
};
