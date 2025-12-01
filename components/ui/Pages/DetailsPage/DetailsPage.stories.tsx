import DetailsPageComponent from "./DetailsPage";
import { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import { View } from "tamagui";

const meta = {
  title: "Pages/DetailsPage",
  component: DetailsPageComponent,
  decorators: [
    (Story: ComponentType) => (
      <View flex={1} bgC="$screenBackground" mt={150}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof DetailsPageComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    beansData: {
      id: 1,
      name: "Toskana",
      roastery: "Toskana",
      degreeOfGrinding: 3.5,
      isFavorite: false,
      singleShotDosis: 18.5,
      arabicaAmount: 100,
      robustaAmount: 0,
      doubleShotDosis: 20,
      taste: [],
    },
    tastes: [
      { flavor: "Chocolate" },
      { flavor: "Nutty" },
      { flavor: "Caramel" },
    ],
    onEditPress: () => console.log("Edit pressed"),
    onDegreePress: () => console.log("Degree pressed"),
  },
};
