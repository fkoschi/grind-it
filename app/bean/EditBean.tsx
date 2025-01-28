import {
  AddRoasteryFrame,
  AddBeanTasteFrame,
  EditBeanTasteFrame,
} from "@/components";

import { Sheet as BottomSheet } from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { FC, PropsWithChildren } from "react";
import { View } from "tamagui";

const EditBean: FC<PropsWithChildren> = ({ children }) => {
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
          dismissOnSnapToBottom: true,
          animation: "medium",
          onOpenChange: () => hideRoasterySheet(false),
        }}
        frame={
          <AddRoasteryFrame
            open={editRoastery}
            onFormSubmit={() => hideRoasterySheet(false)}
          />
        }
      />
      <BottomSheet
        sheetProps={{
          open: editTaste.showSheet,
          modal: false,
          zIndex: 200_000_000,
          snapPointsMode: "percent",
          dismissOnSnapToBottom: true,
          animation: "medium",
          snapPoints: [90],
          onOpenChange: () =>
            hideTasteSheet({ showSheet: false, type: editTaste.type }),
        }}
        frame={
          editTaste.type === "add" ? (
            <AddBeanTasteFrame open={editTaste.showSheet} />
          ) : (
            <EditBeanTasteFrame open={editTaste.showSheet} />
          )
        }
      />
    </View>
  );
};

export default EditBean;
