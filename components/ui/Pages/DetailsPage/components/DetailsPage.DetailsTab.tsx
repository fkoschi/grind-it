import { XStack } from "tamagui";
import { SpiderChart, ProFeatureOverlay } from "@/components/ui";

export const DetailsPageDetailsTab = () => (
  <ProFeatureOverlay>
    <XStack alignItems="center" justifyContent="center" mt="$8">
      <SpiderChart
        data={[
          { label: "blumig", value: 70 },
          { label: "fruchtig", value: 50 },
          { label: "nussig", value: 30 },
          { label: "würzig", value: 50 },
          { label: "süß", value: 20 },
          { label: "bitter", value: 40 },
        ]}
      />
    </XStack>
  </ProFeatureOverlay>
);
