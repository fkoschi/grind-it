import Alert from "@/components/ui/Alert/Alert";
import { useLocalSearchParams } from "expo-router";
import { FC } from "react";
import { View, Text } from "tamagui";

const EditBeanPage: FC = () => {
  const { id: beanId } = useLocalSearchParams();

  return (
    <View flex={1}>
      <Text>Edit Bean {beanId}</Text>
      {/* <Alert /> */}
    </View>
  );
};
export default EditBeanPage;
