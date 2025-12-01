import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import SpiderChart from "./SpiderChart";
import { View } from "tamagui";

const meta = {
  title: "Components/SpiderChart",
  component: SpiderChart,
  decorators: [
    (Story: ComponentType) => (
      <View
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$screenBackground"
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SpiderChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { label: "Säure", value: 80 },
      { label: "Süsse", value: 60 },
      { label: "Bitterkeit", value: 40 },
      { label: "blumig", value: 70 },
      { label: "fruchtig", value: 50 },
      { label: "nussig", value: 30 },
      { label: "würzig", value: 50 },
      { label: "röstartig", value: 60 },
      { label: "Körper", value: 75 },
      { label: "Abgang", value: 65 },
    ],
    size: 350,
  },
};

export const Empty: Story = {
  args: {
    data: [
      { label: "Säure", value: 0 },
      { label: "Süsse", value: 0 },
      { label: "Bitterkeit", value: 0 },
      { label: "blumig", value: 0 },
      { label: "fruchtig", value: 0 },
      { label: "nussig", value: 0 },
      { label: "würzig", value: 0 },
      { label: "röstartig", value: 0 },
      { label: "Körper", value: 0 },
      { label: "Abgang", value: 0 },
    ],
    size: 350,
  },
};
