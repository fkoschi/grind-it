import { FC } from "react";
import { ScrollView, Text, View, YStack, Button } from "tamagui";

interface AromaInfo {
  name: string;
  description: string;
  examples: string;
}

const aromaInfoData: AromaInfo[] = [
  {
    name: "Fruchtig",
    description:
      "Fruchtige Aromen erinnern an verschiedene Früchte wie Beeren, Zitrusfrüchte oder Steinfrüchte. Diese Noten entstehen oft durch die Fermentation während der Aufbereitung und sind besonders bei hellen Röstungen ausgeprägt.",
    examples: "Erdbeere, Brombeere, Zitrone, Limette, Apfel, Pfirsich, Rosine",
  },
  {
    name: "Blumig",
    description:
      "Blumige Noten erinnern an den Duft von Blüten und sind oft delikat und elegant. Sie sind typisch für hochwertige Arabica-Kaffees aus bestimmten Anbaugebieten.",
    examples: "Jasmin, Rose, Kamille, Hibiskus",
  },
  {
    name: "Süß",
    description:
      "Süße Aromen entstehen durch Karamellisierung von Zuckern während der Röstung. Sie verleihen dem Kaffee eine angenehme Rundung und Balance.",
    examples: "Vanille, Karamell, Ahornsirup, brauner Zucker, Honig",
  },
  {
    name: "Nussig/Kakao",
    description:
      "Diese Aromen erinnern an Nüsse und Schokolade und sind charakteristisch für mittlere bis dunkle Röstungen. Sie entstehen durch Maillard-Reaktionen während des Röstprozesses.",
    examples: "Dunkle Schokolade, Haselnuss, Mandel, Erdnuss, Walnuss",
  },
  {
    name: "Gewürze",
    description:
      "Würzige Noten können sowohl süß als auch scharf sein und verleihen dem Kaffee Komplexität und Tiefe.",
    examples: "Nelke, Zimt, Muskatnuss, Pfeffer, Kardamom",
  },
  {
    name: "Röstig",
    description:
      "Röstige Aromen entstehen durch die thermische Zersetzung während der Röstung, besonders bei dunkleren Röstgraden. Sie können von getreidige bis hin zu rauchigen Noten reichen.",
    examples: "Malz, Toast, Rauch, Tabak, Asche",
  },
  {
    name: "Grün/Vegetabil",
    description:
      "Grüne oder vegetabile Noten können auf unreife Bohnen oder zu kurze Röstzeiten hindeuten, können aber in geringen Mengen auch Frische vermitteln.",
    examples: "Gras, frische Kräuter, Erbsenschote, grüne Bohnen",
  },
  {
    name: "Sauer/Fermentiert",
    description:
      "Säuerliche oder fermentierte Noten können erwünschte Komplexität schaffen (wie bei Kaffees mit natürlicher Aufbereitung) oder auf Fehler hinweisen.",
    examples: "Zitronensäure, Essigsäure, Wein, Alkohol, überreife Frucht",
  },
  {
    name: "Andere",
    description:
      "Ungewöhnliche oder unerwünschte Aromen, die oft auf Defekte oder Fehler hinweisen können. Auch einzigartige, schwer kategorisierbare Geschmacksnoten.",
    examples: "Chemisch, medizinisch, gummiartig, erdig, muffig, schimmelig",
  },
];

interface AromaInfoFrameProps {
  onClose: () => void;
}

const AromaInfoFrame: FC<AromaInfoFrameProps> = ({ onClose }) => {
  return (
    <View flex={1} backgroundColor="$screenBackground">
      <View padding="$4" paddingBottom="$2">
        <Text fontSize="$6" fontWeight="bold" color="$copyText">
          Aroma-Rad Informationen
        </Text>
        <Text fontSize="$3" color="$gray400" marginTop="$2">
          Basierend auf dem Coffee Taster's Flavor Wheel
        </Text>
      </View>

      <ScrollView
        flex={1}
        padding="$4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: "$4" }}
      >
        <YStack gap="$4">
          {aromaInfoData.map((aroma, index) => (
            <View
              key={index}
              padding="$4"
              backgroundColor="$white"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <Text
                fontSize="$5"
                fontWeight="bold"
                color="$primary"
                marginBottom="$2"
              >
                {aroma.name}
              </Text>
              <Text
                fontSize="$3"
                color="$copyText"
                lineHeight="$2"
                marginBottom="$3"
              >
                {aroma.description}
              </Text>
              <View backgroundColor="$gray100" padding="$3" borderRadius="$3">
                <Text
                  fontSize="$2"
                  fontWeight="600"
                  color="$gray500"
                  marginBottom="$1"
                >
                  Beispiele:
                </Text>
                <Text fontSize="$3" color="$gray600" lineHeight="$1">
                  {aroma.examples}
                </Text>
              </View>
            </View>
          ))}
        </YStack>
      </ScrollView>

      <View padding="$6" backgroundColor="$white">
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={onClose}
          pressStyle={{ backgroundColor: "$primaryHover" }}
        >
          Schließen
        </Button>
      </View>
    </View>
  );
};

export default AromaInfoFrame;
