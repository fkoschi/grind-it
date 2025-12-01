import { FC } from "react";
import { View, YStack } from "tamagui";
import { useToastStore } from "@/store/toast-store";
import Toast from "./Toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ToastViewport: FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const hideToast = useToastStore((state) => state.hideToast);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      position="absolute"
      top={insets.top + 10}
      left={0}
      right={0}
      zIndex={100000}
      pointerEvents="box-none"
      alignItems="center"
    >
      <YStack gap="$2" width="90%" maxWidth={400}>
        {toasts.map((toast) => (
          <View
            key={toast.id}
            animation="quick"
            enterStyle={{ opacity: 0, y: -20, scale: 0.9 }}
            exitStyle={{ opacity: 0, scale: 0.9, y: -10 }}
            opacity={1}
            scale={1}
            y={0}
          >
            <Toast
              {...toast}
              onClose={() => {
                if (toast.onClose) toast.onClose();
                hideToast(toast.id);
              }}
            />
          </View>
        ))}
      </YStack>
    </View>
  );
};

export default ToastViewport;
