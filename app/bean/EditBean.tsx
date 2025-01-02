import AddRoasteryForm from "@/components/form/roastery/add";
import AddTasteSheet from "@/components/form/taste/AddTasteSheet";
import EditTasteSheet from "@/components/form/taste/EditTasteSheet";
import BottomSheet from "@/components/ui/Sheet/Sheet";
import { useBeanStore } from "@/store/bean-store";
import { FC, PropsWithChildren } from "react";
import { View } from "tamagui";

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
          dismissOnSnapToBottom: true,
          animation: "medium",
          onOpenChange: () => hideRoasterySheet(false),
        }}
        frame={
          <AddRoasteryForm onFormSubmit={() => hideRoasterySheet(false)} />
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
          snapPoints: [editTaste.type === "edit" ? 70 : 90],
          onOpenChange: () =>
            hideTasteSheet({ showSheet: false, type: "edit" }),
        }}
        frame={
          editTaste.type === "add" ? <AddTasteSheet /> : <EditTasteSheet />
        }
      />
    </View>
  );
};

export default EditBean;
