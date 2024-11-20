import { FC } from "react";
import { Text, View } from "tamagui";
import { Image } from "expo-image";
import ThemedText from "@/components/ui/ThemedText";
import Badge from "@/components/ui/Badge/Badge";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import EditIcon from "@/components/ui/Icons/Edit";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const DetailsPage: FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleEditPress = () => router.navigate(`/bean/edit/${id}`);

  return (
    <View flex={1}>
      <View flex={0}>
        <Image
          source={require("@/assets/images/coffee-cup.png")}
          style={{
            position: "absolute",
            zIndex: 1,
            top: -140,
            right: -20,
            width: 200,
            height: 200,
          }}
        />
      </View>
      <View flex={1} p="$6">
        <ThemedText fontSize="$6" color="$primary" fw={500}>
          Supremo
        </ThemedText>
        <Text fontSize="$10" fontFamily="BlackMango-Regular">
          Toskana
        </Text>

        <View>
          <View>
            <ThemedText fw={800} mb="$2">
              Geschmack
            </ThemedText>
            <View
              flex={0}
              flexWrap="wrap"
              flexDirection="row"
              gap={4}
              rowGap={6}
            >
              <Badge title="schokig" />
              <Badge title="nussig" />
            </View>
          </View>
          <View mt="$4">
            <ThemedText fw={800} mb="$2">
              Mahlgrad
            </ThemedText>
            <Text
              fontSize="$16"
              lineHeight="$16"
              color="$primary"
              fontFamily="BlackMango-Regular"
            >
              7.1
            </Text>
          </View>
        </View>
      </View>

      <ActionButton
        bgC="$primary"
        onPress={handleEditPress}
        icon={<EditIcon />}
      />
    </View>
  );
};
export default DetailsPage;
