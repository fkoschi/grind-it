import { FC, useState } from "react";
import { Input, View } from "tamagui";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import ClearIcon from "./ui/Icons/Clear";

interface Props {
  disabled?: boolean;
  onChangeText: (text: string) => void;
}
const Search: FC<Props> = ({ disabled = false, onChangeText }) => {
  const [search, setSearch] = useState<string>();

  const handleChangeText = (search: string) => {
    setSearch(search);
    onChangeText(search);
  };

  const reset = () => {
    setSearch("");
    onChangeText("");
  };

  const showClear = search && search?.length > 0;

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
        flex={1}
        bgC="white"
        borderWidth={0}
        mr="$6"
        borderRadius="$10"
        disabled={disabled}
        value={search}
        onChangeText={handleChangeText}
        placeholder="Search..."
      />
      {showClear && (
        <View position="absolute" right={0}>
          <Pressable
            onPress={reset}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
            }}
          >
            <ClearIcon fill="black" size={16} />
          </Pressable>
        </View>
      )}
    </View>
  );
};
export default Search;
