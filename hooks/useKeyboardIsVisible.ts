import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboardIsVisible = (): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Needed for Android
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () =>
      setIsVisible(true)
    );
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () =>
      setIsVisible(true)
    );
    // Needed for Android 
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () =>
      setIsVisible(false)
    );
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () =>
      setIsVisible(false)
    );

    return () => {
      keyboardDidShow.remove();
      keyboardWillShow.remove();
      keyboardDidHide.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return isVisible;
};

