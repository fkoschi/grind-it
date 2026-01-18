import { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Text, ListItem, View, YGroup, Separator, Spinner } from "tamagui";
import { ChevronRight, Share2, Upload } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Share, Alert, Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import TabBar from "@/components/Navigation/TabBar";
import { ThemedText } from "@/components/ui";
import { useDataExport } from "@/hooks/useDataExport";
import { useDataImport } from "@/hooks/useDataImport";
import * as DocumentPicker from "expo-document-picker";

import { version } from "../package.json";

const SettingsPage: FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { exportData, isExporting } = useDataExport();
  const [isSharing, setIsSharing] = useState(false);

  const { importData, isImporting } = useDataImport();
  const [isPickingFile, setIsPickingFile] = useState(false);

  const handleShareData = async () => {
    setIsSharing(true);
    try {
      const jsonData = await exportData();

      if (!jsonData) {
        Alert.alert("Export fehlgeschlagen", "Die Daten konnten nicht exportiert werden.");
        return;
      }

      const fileName = `grind-it-export-${new Date().toISOString().split("T")[0]}.json`;
      const file = new File(Paths.document, fileName);

      if (file.exists) {
        await file.delete();
      }
      await file.create();
      await file.write(jsonData);

      const shareOptions = Platform.select({
        ios: {
          url: file.uri,
          message: "Grind It Daten Export",
        },
        default: {
          title: "Grind It Daten Export",
          url: file.uri,
        },
      });

      await Share.share(shareOptions);
    } catch (err) {
      console.error("Share error:", err);
      Alert.alert("Fehler", "Beim Teilen ist ein Fehler aufgetreten.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleImportData = async () => {
    if (isPickingFile) return;
    setIsPickingFile(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const file = new File(fileUri);
      const fileContent = await file.text();

      try {
        const parsedData = JSON.parse(fileContent);
        const beanCount = parsedData.beans?.length || 0;

        Alert.alert(
          "Daten importieren",
          `${beanCount} Bohne(n) gefunden. Möchtest du diese importieren? Vorhandene Duplikate werden übersprungen.`,
          [
            {
              text: "Abbrechen",
              style: "cancel",
            },
            {
              text: "Importieren",
              onPress: async () => {
                const importResult = await importData(fileContent, true);

                if (importResult?.success) {
                  Alert.alert(
                    "Import erfolgreich",
                    `${importResult.beansCreated} Bohnen importiert.\n${importResult.beansSkipped} Duplikate übersprungen.`,
                  );
                } else if (importResult) {
                  Alert.alert(
                    "Import mit Fehlern",
                    `Importiert: ${importResult.beansCreated}\nFehler: ${importResult.errors.join("\n")}`,
                  );
                }
              },
            },
          ],
        );
      } catch {
        Alert.alert(
          "Fehler",
          "Die Datei konnte nicht gelesen werden. Ist es eine gültige JSON-Datei?",
        );
      }
    } catch (err) {
      console.error("Import error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Different document picking in progress")) {
        // Ignore this specific error as it means the user just tapped too fast
        return;
      }
      Alert.alert("Fehler", "Beim Importieren ist ein Fehler aufgetreten.");
    } finally {
      setIsPickingFile(false);
    }
  };

  return (
    <View bgC={"$screenBackground"} flex={1}>
      <View flex={1} pt={insets.top}>
        <View alignItems="center" mt="$6">
          <Avatar circular size="$10">
            <Avatar.Image
              accessibilityLabel="Grind It Logo"
              src={require("@/assets/images/icon.png")}
            />
          </Avatar>
          <Text fontSize={24} fontFamily="TBJSodabery-LightOriginal">
            Grind It
          </Text>
          <ThemedText fw={400}>v.{version}</ThemedText>
        </View>
        <YGroup mt="$4" p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/roasteries/EditRoasteryPage")}
            >
              Röstereien
            </ListItem>
          </YGroup.Item>
          <Separator />
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={ChevronRight}
              onPress={() => router.navigate("/taste/EditTasteComponent")}
            >
              Geschmack
            </ListItem>
          </YGroup.Item>
        </YGroup>
        <YGroup p="$4">
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={isExporting || isSharing ? Spinner : Share2}
              onPress={handleShareData}
              disabled={isExporting || isSharing}
              opacity={isExporting || isSharing ? 0.5 : 1}
            >
              Daten exportieren & teilen
            </ListItem>
          </YGroup.Item>
          <Separator />
          <YGroup.Item>
            <ListItem
              pressTheme
              bgC="$white"
              iconAfter={isImporting || isPickingFile ? Spinner : Upload}
              onPress={handleImportData}
              disabled={isImporting || isPickingFile}
              opacity={isImporting || isPickingFile ? 0.5 : 1}
            >
              Daten importieren
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </View>
      <TabBar />
    </View>
  );
};
export default SettingsPage;
