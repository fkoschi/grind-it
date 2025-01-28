import { FC, ReactElement } from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

interface Props {
  title?: string;
  description: string;
  cancelTitle?: string;
  actionTitle?: string;
  onActionPress: () => void;
  alertTrigger?: ReactElement;
}
const Alert: FC<Props> = ({
  title,
  description,
  cancelTitle = "Cancel",
  actionTitle = "Accept",
  onActionPress,
  alertTrigger,
}) => {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>{alertTrigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            {title && <AlertDialog.Title>{title}</AlertDialog.Title>}

            <AlertDialog.Description>{description}</AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>{cancelTitle}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild onPress={onActionPress}>
                <Button theme="active">{actionTitle}</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
export default Alert;
