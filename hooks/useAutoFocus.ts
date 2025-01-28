import { RefObject, useEffect } from "react";
import { Input } from "tamagui";

export const useAutoFocus = (ref: RefObject<Input>, open?: boolean) => {
  useEffect(() => {
    if (open) {
      ref.current?.focus();
    }
  }, [open, ref]);
};
