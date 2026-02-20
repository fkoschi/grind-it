import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentType } from "react";
import { View, Input } from "tamagui";
import RoasteryDetailPageUI from "./RoasteryDetailPage";

const MOCK_ROASTERY_FULL = {
  id: 1,
  name: "The Barn",
  website: "https://thebarn.de",
  address: "Schönhauser Allee 8, 10119 Berlin, Germany",
  latitude: 52.539,
  longitude: 13.412,
  rating: 4,
};

const MOCK_ROASTERY_MINIMAL = {
  id: 2,
  name: "Five Elephant",
  website: null,
  address: null,
  latitude: null,
  longitude: null,
  rating: null,
};

const MOCK_ROASTERY_PARTIAL = {
  id: 3,
  name: "Bonanza Coffee",
  website: "https://bonanzacoffee.de",
  address: null,
  latitude: null,
  longitude: null,
  rating: 3,
};

const meta = {
  title: "Pages/RoasteryDetail",
  component: RoasteryDetailPageUI,
  decorators: [
    (Story: ComponentType) => (
      <View flex={1} bgC="$screenBackground">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof RoasteryDetailPageUI>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullData: Story = {
  args: {
    roastery: MOCK_ROASTERY_FULL,
    isDirty: false,
    currentRating: 4,
    onBack: () => {},
    onRatingPress: () => {},
    onClearRating: () => {},
    onOpenWebsite: () => {},
    onOpenMaps: () => {},
    onSearchAddress: () => {},
    onSave: () => {},
    nameValue: "The Barn",
    websiteValue: "https://thebarn.de",
    addressValue: "Schönhauser Allee 8, 10119 Berlin, Germany",
    renderNameInput: () => (
      <Input borderWidth={0} bgC="white" borderRadius="$4" value="The Barn" size="$4" />
    ),
    renderWebsiteInput: () => (
      <Input borderWidth={0} bgC="white" borderRadius="$4" value="https://thebarn.de" size="$4" />
    ),
  },
};

export const EmptyState: Story = {
  args: {
    roastery: MOCK_ROASTERY_MINIMAL,
    isDirty: false,
    currentRating: 0,
    onBack: () => {},
    onRatingPress: () => {},
    onClearRating: () => {},
    onOpenWebsite: () => {},
    onOpenMaps: () => {},
    onSearchAddress: () => {},
    onSave: () => {},
    nameValue: "Five Elephant",
    websiteValue: "",
    addressValue: "",
    renderNameInput: () => (
      <Input borderWidth={0} bgC="white" borderRadius="$4" value="Five Elephant" size="$4" />
    ),
    renderWebsiteInput: () => (
      <Input borderWidth={0} bgC="white" borderRadius="$4" placeholder="https://..." size="$4" />
    ),
  },
};

export const WithRatingAndWebsite: Story = {
  args: {
    roastery: MOCK_ROASTERY_PARTIAL,
    isDirty: true,
    currentRating: 3,
    onBack: () => {},
    onRatingPress: () => {},
    onClearRating: () => {},
    onOpenWebsite: () => {},
    onOpenMaps: () => {},
    onSearchAddress: () => {},
    onSave: () => {},
    nameValue: "Bonanza Coffee",
    websiteValue: "https://bonanzacoffee.de",
    addressValue: "",
    renderNameInput: () => (
      <Input borderWidth={0} bgC="white" borderRadius="$4" value="Bonanza Coffee" size="$4" />
    ),
    renderWebsiteInput: () => (
      <Input
        borderWidth={0}
        bgC="white"
        borderRadius="$4"
        value="https://bonanzacoffee.de"
        size="$4"
      />
    ),
  },
};
