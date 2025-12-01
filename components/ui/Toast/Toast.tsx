import { FC } from "react";
import { View, XStack, getFontSize } from "tamagui";
import ThemedText from "../Text/ThemedText";
import { CheckIcon, ClearIcon } from "../Icons";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  /**
   * The message to display in the toast
   */
  message: string;
  /**
   * The variant of the toast (success, error, info)
   * @default "info"
   */
  variant?: ToastVariant;
  /**
   * Optional icon to display. If not provided, default icons will be used based on variant
   */
  icon?: React.ReactNode;
  /**
   * Whether to show a close button
   * @default false
   */
  showClose?: boolean;
  /**
   * Callback when close button is pressed
   */
  onClose?: () => void;
}

const Toast: FC<ToastProps> = ({
  message,
  variant = "info",
  icon,
  showClose = false,
  onClose,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "success":
        return "$primaryGreen";
      case "error":
        return "$error";
      case "info":
      default:
        return "$secondary";
    }
  };

  const getDefaultIcon = () => {
    switch (variant) {
      case "success":
        return <CheckIcon />;
      case "error":
        return <ClearIcon size={20} fill="white" />;
      case "info":
      default:
        return null;
    }
  };

  const displayIcon = icon !== undefined ? icon : getDefaultIcon();

  return (
    <View
      bgC={getBackgroundColor()}
      borderRadius="$4"
      p="$3"
      px="$4"
      minWidth={280}
      maxWidth={400}
    >
      <XStack alignItems="center" gap="$3">
        {displayIcon && <View flex={0}>{displayIcon}</View>}

        <View flex={1}>
          <ThemedText
            fw={500}
            fontSize={getFontSize("$5")}
            lineHeight={getFontSize("$6")}
            color="white"
          >
            {message}
          </ThemedText>
        </View>

        {showClose && onClose && (
          <View
            flex={0}
            onPress={onClose}
            cursor="pointer"
            pressStyle={{ opacity: 0.7 }}
          >
            <ClearIcon fill="white" size={18} />
          </View>
        )}
      </XStack>
    </View>
  );
};

export default Toast;
