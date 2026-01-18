import { FC, useState } from "react";
import { ScrollView, Text, View, XStack, Button } from "tamagui";
import { AromaSlider } from "@/components/ui";

export interface AromaValues {
  aromaFruity: number;
  aromaFloral: number;
  aromaSweet: number;
  aromaNutty: number;
  aromaSpices: number;
  aromaRoasted: number;
  aromaGreen: number;
  aromaSour: number;
  aromaOther: number;
}

interface EditAromaFrameProps {
  initialValues: Partial<AromaValues>;
  onSave: (values: AromaValues) => void;
  onCancel: () => void;
}

const EditAromaFrame: FC<EditAromaFrameProps> = ({ initialValues, onSave, onCancel }) => {
  const [values, setValues] = useState<AromaValues>({
    aromaFruity: initialValues.aromaFruity ?? 0,
    aromaFloral: initialValues.aromaFloral ?? 0,
    aromaSweet: initialValues.aromaSweet ?? 0,
    aromaNutty: initialValues.aromaNutty ?? 0,
    aromaSpices: initialValues.aromaSpices ?? 0,
    aromaRoasted: initialValues.aromaRoasted ?? 0,
    aromaGreen: initialValues.aromaGreen ?? 0,
    aromaSour: initialValues.aromaSour ?? 0,
    aromaOther: initialValues.aromaOther ?? 0,
  });

  const updateValue = (key: keyof AromaValues, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(values);
  };

  return (
    <View flex={1} backgroundColor="$screenBackground">
      <View padding="$4" paddingBottom="$2">
        <Text fontSize="$6" fontWeight="bold" color="$copyText">
          Aroma-Profil bearbeiten
        </Text>
        <Text fontSize="$3" color="$gray400" marginTop="$2">
          Passe die Aromastärken für diese Bohne an (0-100)
        </Text>
      </View>

      <ScrollView
        flex={1}
        padding="$4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: "$4" }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View gap="$4">
          <AromaSlider
            label="Fruchtig"
            value={values.aromaFruity}
            onChange={(v: number) => updateValue("aromaFruity", v)}
          />
          <AromaSlider
            label="Blumig"
            value={values.aromaFloral}
            onChange={(v: number) => updateValue("aromaFloral", v)}
          />
          <AromaSlider
            label="Süß"
            value={values.aromaSweet}
            onChange={(v: number) => updateValue("aromaSweet", v)}
          />
          <AromaSlider
            label="Nussig/Kakao"
            value={values.aromaNutty}
            onChange={(v: number) => updateValue("aromaNutty", v)}
          />
          <AromaSlider
            label="Gewürze"
            value={values.aromaSpices}
            onChange={(v: number) => updateValue("aromaSpices", v)}
          />
          <AromaSlider
            label="Röstig"
            value={values.aromaRoasted}
            onChange={(v: number) => updateValue("aromaRoasted", v)}
          />
          <AromaSlider
            label="Grün/Vegetabil"
            value={values.aromaGreen}
            onChange={(v: number) => updateValue("aromaGreen", v)}
          />
          <AromaSlider
            label="Sauer/Fermentiert"
            value={values.aromaSour}
            onChange={(v: number) => updateValue("aromaSour", v)}
          />
          <AromaSlider
            label="Andere"
            value={values.aromaOther}
            onChange={(v: number) => updateValue("aromaOther", v)}
          />
        </View>
      </ScrollView>

      <XStack padding="$6" gap="$3" backgroundColor="$white">
        <Button
          flex={1}
          size="$4"
          backgroundColor="$gray200"
          color="$copyText"
          onPress={onCancel}
          pressStyle={{ backgroundColor: "$gray300" }}
        >
          Abbrechen
        </Button>
        <Button
          flex={1}
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={handleSave}
          pressStyle={{ backgroundColor: "$primaryHover" }}
        >
          Speichern
        </Button>
      </XStack>
    </View>
  );
};

export default EditAromaFrame;
