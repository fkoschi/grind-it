import AddRoasteryForm from "@/components/form/roastery/add";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import { useBeanStore } from "@/store/bean-store";
import { FC, PropsWithChildren, useState } from "react";
import { View, Text } from "tamagui";

interface Props extends PropsWithChildren {}
const Bean: FC<Props> = ({ children }) => {
  const editRoastery = useBeanStore((state) => state.editRoastery);
  const hideSheet = useBeanStore((state) => state.updateEditRoastery);

  return (
    <View flex={1}>
      {children}
      <BottomSheet
        sheetProps={{
          open: editRoastery,
          modal: false,
          zIndex: 100_000,
          snapPointsMode: "constant",
          animation: "medium",
          onOpenChange: () => hideSheet(false),
        }}
        frame={<AddRoasteryForm onFormSubmit={() => hideSheet(false)} />}
      />
    </View>
  );
};

export default Bean;
