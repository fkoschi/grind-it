import { FC } from "react";
import { Input, View } from "tamagui";
import { Image } from "expo-image";

interface Props {
  disabled: boolean;
}
const Search: FC<Props> = ({ disabled }) => {
  return (
    <View
      flex={1}
      bgC="white"
      flexDirection="row"
      borderRadius="$10"
      alignItems="center"
    >
      <View width={40} alignItems="center">
        <Image
          source={require("@/assets/icons/search.png")}
          contentFit="contain"
          style={{ width: 24, flex: 1, marginLeft: 8 }}
        />
      </View>
      <Input
        my="$0"
        py="$0"
        bgC="white"
        borderWidth={0}
        borderRadius="$10"
        disabled={disabled}
        placeholder="Search..."
      />
    </View>
  );
};
export default Search;
