import { FC, ReactElement } from "react";
import { Sheet, SheetProps } from "tamagui";

interface Props {
  sheetProps: SheetProps;
  frame: ReactElement;
}
const BottomSheet: FC<Props> = ({ sheetProps, frame }) => {
  return (
    <Sheet animation="medium" {...sheetProps}>
      <Sheet.Overlay animation="medium" />
      <Sheet.Handle />
      <Sheet.Frame>{frame}</Sheet.Frame>
    </Sheet>
  );
};

export default BottomSheet;
