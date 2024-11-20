import { FC, ReactElement } from "react";
import { Sheet, SheetProps } from "tamagui";

interface Props {
  sheetProps: SheetProps;
  frame: ReactElement;
}
const BottomSheet: FC<Props> = ({ sheetProps, frame }) => {
  return (
    <Sheet {...sheetProps}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>{frame}</Sheet.Frame>
    </Sheet>
  );
};

export default BottomSheet;
