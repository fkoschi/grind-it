import { usePathname } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { useEffect, useState } from "react";

export const useIsRouteActive = (path: string): boolean => {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  // Monitor navigation state
  const isNavigationActive = useNavigationState((state) => {
    // Check if the current route matches the target path
    return state.routes.some((route) => route.name === path);
  });

  useEffect(() => {
    // Combine pathname and navigation state to determine activity
    setIsActive(pathname === path || isNavigationActive);
  }, [pathname, isNavigationActive, path]);

  return isActive;
};
