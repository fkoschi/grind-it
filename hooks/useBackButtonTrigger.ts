import { useNavigation } from "expo-router";
import { useEffect } from "react";

/**
 * Hook that logs when the back button is triggered
 * @param callback Optional callback function to run when back button is triggered
 */
export const useBackButtonTrigger = (callback?: () => void) => {
  const navigation = useNavigation();

  useEffect(() => {
    // Add a listener for the 'beforeRemove' event which fires when back button is pressed
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // If a callback was provided, execute it
      if (callback) {
        callback();
      }
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation, callback]);
};
