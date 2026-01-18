import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: async () => {
      return null;
    },
    setItem: async () => {},
  },
});

export default StorybookUIRoot;
