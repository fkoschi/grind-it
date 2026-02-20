import { FC, useEffect, useRef, useState } from "react";
import { Button, Input, ScrollView, Spinner, Text, View, XStack, YStack } from "tamagui";
import ThemedText from "@/components/ui/Text/ThemedText";
import { MapPin, Search } from "@tamagui/lucide-icons";
import { useTranslation } from "react-i18next";
import { useAutoFocus } from "@/hooks/useAutoFocus";
import { TextInput } from "react-native";

interface PlaceResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface GooglePlacesFrameProps {
  initialAddress?: string;
  open?: boolean;
  onSelect: (address: string, lat?: number, lng?: number) => void;
  onClose: () => void;
}

const GooglePlacesFrame: FC<GooglePlacesFrameProps> = ({ open = true, onSelect, onClose }) => {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state each time the sheet opens so previous results don't linger
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [open]);

  useAutoFocus(inputRef, open);

  const searchAddress = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const encoded = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "GrindItApp/1.0",
          },
        },
      );
      const data: PlaceResult[] = await response.json();
      setResults(data);
      if (data.length === 0) {
        setError(t("roastery.addressNoResults"));
      }
    } catch {
      setError(t("roastery.addressSearchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: PlaceResult) => {
    onSelect(result.display_name, parseFloat(result.lat), parseFloat(result.lon));
  };

  return (
    <View flex={1} p="$4">
      <Text fontSize="$8" mb="$4" fontFamily="$sodabery">
        {t("roastery.searchAddress")}
      </Text>

      <XStack gap="$2" alignItems="center" mb="$4">
        <View flex={1}>
          <Input
            ref={inputRef}
            borderWidth={1}
            borderColor="$screenBackground"
            bgC="$screenBackground"
            borderRadius="$4"
            placeholder={t("roastery.addressSearchPlaceholder")}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchAddress}
            returnKeyType="search"
            size="$4"
            focusStyle={{ borderColor: "$primary" }}
          />
        </View>
        <Button
          circular
          bgC="$secondary"
          height={44}
          minHeight={44}
          width={44}
          minWidth={44}
          onPress={searchAddress}
          pressStyle={{ bgC: "$secondaryHover" }}
          disabled={loading}
        >
          {loading ? <Spinner size="small" color="white" /> : <Search size={18} color="white" />}
        </Button>
      </XStack>

      {error && (
        <ThemedText fw={400} fontSize={13} color="$error" mb="$3">
          {error}
        </ThemedText>
      )}

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$2">
          {results.map((result, index) => (
            <Button
              key={index}
              onPress={() => handleSelect(result)}
              bgC="white"
              justifyContent="flex-start"
              pressStyle={{ bgC: "$screenBackground" }}
              size="$4"
              borderRadius="$4"
              height="auto"
              py="$3"
            >
              <XStack gap="$3" alignItems="flex-start" flex={1}>
                <MapPin size={16} color="$primary" mt="$1" />
                <ThemedText fw={400} fontSize={13} color="$secondary" flex={1} flexWrap="wrap">
                  {result.display_name}
                </ThemedText>
              </XStack>
            </Button>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default GooglePlacesFrame;
