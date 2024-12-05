import AddRoasteryForm from "@/components/form/roastery/add";
import AddTasteForm from "@/components/form/taste/add";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import { useBeanStore } from "@/store/bean-store";
import { FC, PropsWithChildren, useState } from "react";
import { View, Text } from "tamagui";

interface Props extends PropsWithChildren {}
const EditBean: FC<Props> = ({ children }) => {
  const editRoastery = useBeanStore((state) => state.editRoastery);
  const editTaste = useBeanStore((state) => state.editBeanTaste);
  const hideRoasterySheet = useBeanStore((state) => state.updateEditRoastery);
  const hideTasteSheet = useBeanStore((state) => state.updateEditBeanTaste);

  return (
    <View flex={1}>
      {children}
      <BottomSheet
        sheetProps={{
          open: editRoastery,
          modal: false,
          zIndex: 200_000_000,
          snapPointsMode: "percent",
          animation: "medium",
          onOpenChange: () => hideRoasterySheet(false),
        }}
        frame={
          <AddRoasteryForm onFormSubmit={() => hideRoasterySheet(false)} />
        }
      />
      <BottomSheet
        sheetProps={{
          open: editTaste,
          modal: false,
          zIndex: 200_000_000,
          snapPointsMode: "percent",
          animation: "medium",
          onOpenChange: () => hideTasteSheet(false),
        }}
        frame={<AddTasteForm />}
      />
    </View>
  );
};

export default EditBean;
