import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: async (key: string) => {
      return null;
    },
    setItem: async (key: string, value: string) => {},
  },
});

export default StorybookUIRoot;
