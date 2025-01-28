import { FC } from "react";
import { Spinner, View } from "tamagui";

const LoadingScreen: FC = () => (
  <View flex={1} justifyContent="center">
    <Spinner size="small" />
  </View>
);

export default LoadingScreen;
