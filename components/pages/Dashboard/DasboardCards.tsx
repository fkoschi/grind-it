import { CoffeeBean } from "@/types";
import { FC } from "react";
import { ScrollView } from "tamagui";
import Card from "@/components/ui/Card/Card";
import DashboardEmpty from "./DashboardEmpty";
import DashboardNoData from "./DashboardNoData";

interface Props {
  beansData?: Array<CoffeeBean>;
  isFilterActive?: boolean;
}
const DashboardCards: FC<Props> = ({ beansData, isFilterActive = false }) => {
  const noData = !beansData?.length;

  if (noData) {
    if (isFilterActive) {
      return <DashboardNoData />;
    }
    return <DashboardEmpty />
  }

  return (
    <ScrollView bgC="$screenBackground" flex={1} pl="$8" pt="$4" pr="$8">
      {beansData?.map((bean, i) => (
        <Card key={`dashboard-card-${i}`} data={bean} />
      ))}
    </ScrollView>
  );
};
export default DashboardCards;
