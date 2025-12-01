import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import Toast from "./Toast";
import { View, Button, YStack } from "tamagui";
import { HeartIcon } from "../Icons";
import { useToastStore } from "@/store/toast-store";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story: ComponentType) => (
      <View
        p="$4"
        bgC="$screenBackground"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

const ToastTrigger = ({ title, ...props }: any) => {
  const { showToast } = useToastStore();
  return <Button onPress={() => showToast(props)}>{title}</Button>;
};

export const Success: Story = {
  render: () => (
    <ToastTrigger
      title="Show Success Toast"
      message="Bean saved successfully!"
      variant="success"
    />
  ),
};

export const Error: Story = {
  render: () => (
    <ToastTrigger
      title="Show Error Toast"
      message="Failed to save bean. Please try again."
      variant="error"
    />
  ),
};

export const Info: Story = {
  render: () => (
    <ToastTrigger
      title="Show Info Toast"
      message="This is an informational message"
      variant="info"
    />
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <ToastTrigger
      title="Show Toast with Close"
      message="You can close this toast"
      variant="success"
      showClose={true}
      onClose={() => console.log("Toast closed")}
    />
  ),
};

export const LongMessage: Story = {
  render: () => (
    <ToastTrigger
      title="Show Long Message"
      message="This is a very long message that demonstrates how the toast handles longer text content. It should wrap properly and maintain good readability."
      variant="info"
      showClose={true}
    />
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <ToastTrigger
      title="Show Custom Icon"
      message="Added to favorites"
      variant="success"
      icon={<HeartIcon fill="white" size={20} />}
    />
  ),
};

export const NoIcon: Story = {
  render: () => (
    <ToastTrigger
      title="Show No Icon"
      message="Simple message without an icon"
      variant="info"
      icon={null}
    />
  ),
};

export const ErrorWithClose: Story = {
  render: () => (
    <ToastTrigger
      title="Show Error with Close"
      message="Connection failed"
      variant="error"
      showClose={true}
      onClose={() => console.log("Error toast dismissed")}
    />
  ),
};

const InteractiveExampleComponent = () => {
  const { showToast } = useToastStore();

  return (
    <YStack gap="$4">
      <Button
        onPress={() =>
          showToast({
            message: "Success! Item saved.",
            variant: "success",
            duration: 3000,
          })
        }
        theme="active"
      >
        Show Success Toast
      </Button>

      <Button
        onPress={() =>
          showToast({
            message: "Something went wrong",
            variant: "error",
            showClose: true,
          })
        }
        bgC="$error"
      >
        Show Error Toast
      </Button>

      <Button
        onPress={() =>
          showToast({
            message: "Did you know? Coffee is a fruit.",
            variant: "info",
            duration: 5000,
          })
        }
      >
        Show Info Toast
      </Button>
    </YStack>
  );
};

export const InteractiveExample: Story = {
  render: () => <InteractiveExampleComponent />,
};
