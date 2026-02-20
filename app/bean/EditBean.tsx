import {
  AddRoasteryFrame,
  AddBeanTasteFrame,
  EditBeanTasteFrame,
  SelectRoasteryFrame,
} from "@/components";

import { Sheet as BottomSheet } from "@/components/ui";
import { useBeanStore } from "@/store/bean-store";
import { FC, PropsWithChildren } from "react";
import { View } from "tamagui";

interface EditBeanProps extends PropsWithChildren {
  selectedRoasteryId?: number;
  onRoasterySelect?: (id: number) => void;
  onRoasteryCreated?: (id: number) => void;
}

const EditBean: FC<EditBeanProps> = ({
  children,
  selectedRoasteryId,
  onRoasterySelect,
  onRoasteryCreated,
}) => {
  const editRoastery = useBeanStore((state) => state.editRoastery);
  const selectRoastery = useBeanStore((state) => state.selectRoastery);
  const editTaste = useBeanStore((state) => state.editBeanTaste);
  const hideRoasterySheet = useBeanStore((state) => state.updateEditRoastery);
  const hideSelectRoasterySheet = useBeanStore((state) => state.updateSelectRoastery);
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
            onFormSubmit={(newId) => {
              hideRoasterySheet(false);
              onRoasterySelect?.(newId);
              onRoasteryCreated?.(newId);
            }}
          />
        }
      />
      {onRoasterySelect && (
        <BottomSheet
          sheetProps={{
            open: selectRoastery,
            modal: false,
            zIndex: 200_000_000,
            snapPointsMode: "percent",
            dismissOnSnapToBottom: true,
            animation: "medium",
            snapPoints: [60],
            onOpenChange: () => hideSelectRoasterySheet(false),
          }}
          frame={
            <SelectRoasteryFrame
              selectedRoasteryId={selectedRoasteryId}
              onSelect={onRoasterySelect}
              onClose={() => hideSelectRoasterySheet(false)}
            />
          }
        />
      )}
      <BottomSheet
        sheetProps={{
          open: editTaste.showSheet,
          modal: false,
          zIndex: 200_000_000,
          snapPointsMode: "percent",
          dismissOnSnapToBottom: true,
          animation: "medium",
          snapPoints: [90],
          onOpenChange: () => hideTasteSheet({ showSheet: false, type: editTaste.type }),
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
