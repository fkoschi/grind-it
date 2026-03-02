import { FC } from "react";
import { Button, ScrollView, Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import ThemedText from "@/components/ui/Text/ThemedText";
import { Globe, MapPin, Star } from "@tamagui/lucide-icons";
import { useTranslation } from "react-i18next";
import { ActionButton, SaveIcon } from "@/components/ui";

export interface RoasteryDetailData {
  id: number;
  name: string;
  website?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | null;
}

interface RoasteryDetailPageUIProps {
  roastery: RoasteryDetailData;
  isDirty?: boolean;
  currentRating: number;
  onBack: () => void;
  onRatingPress: (star: number) => void;
  onClearRating: () => void;
  onOpenWebsite: () => void;
  onOpenMaps: () => void;
  onSearchAddress: () => void;
  onSave: () => void;
  nameValue: string;
  websiteValue: string;
  addressValue: string;
  renderNameInput: () => React.ReactNode;
  renderWebsiteInput: () => React.ReactNode;
}

const RoasteryDetailPageUI: FC<RoasteryDetailPageUIProps> = ({
  roastery,
  isDirty,
  currentRating,
  onBack,
  onRatingPress,
  onClearRating,
  onOpenWebsite,
  onOpenMaps,
  onSearchAddress,
  onSave,
  websiteValue,
  addressValue,
  renderNameInput,
  renderWebsiteInput,
}) => {
  const { t } = useTranslation();

  return (
    <View flex={1} bgC="$screenBackground">
      <LinearGradient
        height={"$18"}
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
      >
        <View>
          <Pressable style={{ position: "absolute", top: 80, left: 32 }} onPress={onBack}>
            <ThemedText fw={600} fontSize={16} color="$white">
              ←
            </ThemedText>
          </Pressable>
        </View>
        <View flex={1} justifyContent="flex-end" alignItems="center">
          <Text fontSize={32} c="$white" fontFamily="$sodabery" mb="$6">
            {roastery.name}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView flex={1} py="$6" px="$6">
        <YStack gap="$4" pb="$12">
          {/* Name */}
          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("common.name")}
            </ThemedText>
            {renderNameInput()}
          </YStack>

          {/* Rating */}
          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("roastery.rating")}
            </ThemedText>
            <XStack gap="$3" alignItems="center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => onRatingPress(star)}>
                  <Star
                    size={28}
                    color={star <= currentRating ? "#E89E3F" : "#D9D9D9"}
                    fill={star <= currentRating ? "#E89E3F" : "transparent"}
                  />
                </Pressable>
              ))}
              {currentRating > 0 && (
                <Pressable onPress={onClearRating}>
                  <ThemedText fw={400} fontSize={12} color="$copyText">
                    {t("roastery.clearRating")}
                  </ThemedText>
                </Pressable>
              )}
            </XStack>
          </YStack>

          {/* Website */}
          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("roastery.website")}
            </ThemedText>
            <XStack gap="$2" alignItems="center">
              <View flex={1}>{renderWebsiteInput()}</View>
              {!!websiteValue && (
                <Button
                  circular
                  size="$3"
                  bgC="$secondary"
                  onPress={onOpenWebsite}
                  pressStyle={{ bgC: "$secondaryHover" }}
                >
                  <Globe size={16} color="white" />
                </Button>
              )}
            </XStack>
          </YStack>

          {/* Address */}
          <YStack gap="$2">
            <ThemedText fw={600} fontSize={12} color="$copyText">
              {t("roastery.address")}
            </ThemedText>
            <XStack gap="$2" alignItems="center">
              <Button
                unstyled
                flex={1}
                bgC="white"
                borderRadius="$4"
                px="$3"
                py="$3"
                minHeight={44}
                justifyContent="center"
                alignItems="flex-start"
                onPress={onSearchAddress}
                pressStyle={{ opacity: 0.7 }}
              >
                <ThemedText
                  fw={400}
                  fontSize={14}
                  color={addressValue ? "$secondary" : "$placeholderColor"}
                >
                  {addressValue || t("roastery.addressPlaceholder")}
                </ThemedText>
              </Button>
              {!!addressValue && (
                <Button
                  circular
                  size="$3"
                  bgC="$primary"
                  onPress={onOpenMaps}
                  pressStyle={{ bgC: "$primaryHover" }}
                >
                  <MapPin size={16} color="white" />
                </Button>
              )}
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      {isDirty && (
        <ActionButton
          bgC="$primaryGreen"
          icon={<SaveIcon />}
          onPress={onSave}
          pressStyle={{ backgroundColor: "$primaryGreen" }}
        />
      )}
    </View>
  );
};

export default RoasteryDetailPageUI;
