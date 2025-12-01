import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import { Tabs } from "./Tabs";
import { View, Text } from "tamagui";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  decorators: [
    (Story: ComponentType) => (
      <View flex={1} padding="$4" backgroundColor="$screenBackground">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "tab1",
    children: null,
  },
  render: () => (
    <Tabs defaultValue="tab1" width="100%">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Password</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" padding="$4">
        <Text color="black">Make changes to your account here.</Text>
      </Tabs.Content>
      <Tabs.Content value="tab2" padding="$4">
        <Text>Change your password here.</Text>
      </Tabs.Content>
      <Tabs.Content value="tab3" padding="$4">
        <Text>Adjust your settings here.</Text>
      </Tabs.Content>
    </Tabs>
  ),
};
