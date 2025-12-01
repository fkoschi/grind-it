import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import Card from "./Card";
import { View } from "tamagui";

const meta = {
  title: "Components/Card",
  component: Card,
  decorators: [
    (Story: ComponentType) => (
      <View p="$4" bgC="$screenBackground" flex={1} maxHeight={200}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      roastery: "The Barn",
      degreeOfGrinding: 3.5,
      isFavorite: false,
      singleShotDosis: 18.5,
      doubleShotDosis: 20.0,
    },
  },
};

export const NoDosis: Story = {
  args: {
    data: {
      id: 2,
      name: "Colombia Huila",
      roastery: "Five Elephant",
      degreeOfGrinding: 4.0,
      isFavorite: true,
    },
  },
};

export const LongName: Story = {
  args: {
    data: {
      id: 3,
      name: "Very Long Coffee Name That Should Truncate Properly In The Card Component",
      roastery: "Roastery With A Long Name",
      degreeOfGrinding: 2.5,
      isFavorite: false,
      singleShotDosis: 19.0,
      doubleShotDosis: 21.5,
    },
  },
};
