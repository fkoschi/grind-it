import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import Toast, { type ToastProps } from "./Toast";
import { View, Button, YStack } from "tamagui";
import { HeartIcon } from "../Icons";
import { useToastStore } from "@/store/toast-store";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story: ComponentType) => (
      <View p="$4" bgC="$screenBackground" flex={1} justifyContent="center" alignItems="center">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

interface ToastTriggerProps extends ToastProps {
  title: string;
}

const ToastTrigger = ({ title, ...props }: ToastTriggerProps) => {
  const { showToast } = useToastStore();
  return <Button onPress={() => showToast(props)}>{title}</Button>;
};

export const Success: Story = {
  args: { message: "Bean saved successfully!", variant: "success" },
  render: (args) => <ToastTrigger title="Show Success Toast" {...args} />,
};

export const Error: Story = {
  args: { message: "Failed to save bean. Please try again.", variant: "error" },
  render: (args) => <ToastTrigger title="Show Error Toast" {...args} />,
};

export const Info: Story = {
  args: { message: "This is an informational message", variant: "info" },
  render: (args) => <ToastTrigger title="Show Info Toast" {...args} />,
};

export const WithCloseButton: Story = {
  args: { message: "You can close this toast", variant: "success", showClose: true },
  render: (args) => <ToastTrigger title="Show Toast with Close" {...args} />,
};

export const LongMessage: Story = {
  args: {
    message:
      "This is a very long message that demonstrates how the toast handles longer text content. It should wrap properly and maintain good readability.",
    variant: "info",
    showClose: true,
  },
  render: (args) => <ToastTrigger title="Show Long Message" {...args} />,
};

export const CustomIcon: Story = {
  args: { message: "Added to favorites", variant: "success" },
  render: (args) => (
    <ToastTrigger title="Show Custom Icon" {...args} icon={<HeartIcon fill="white" size={20} />} />
  ),
};

export const NoIcon: Story = {
  args: { message: "Simple message without an icon", variant: "info" },
  render: (args) => <ToastTrigger title="Show No Icon" {...args} icon={null} />,
};

export const ErrorWithClose: Story = {
  args: { message: "Connection failed", variant: "error", showClose: true },
  render: (args) => <ToastTrigger title="Show Error with Close" {...args} />,
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
  args: { message: "Interactive demo" },
  render: () => <InteractiveExampleComponent />,
};
