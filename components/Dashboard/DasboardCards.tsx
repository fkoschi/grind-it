import { CoffeeBean } from "@/types";
import { FC } from "react";
import { ScrollView } from "tamagui";
import Card from "@/components/ui/Card/Card";
import DashboardNoData from "./DashboardNoData";

interface Props {
  beansData?: CoffeeBean[];
}
const DashboardCards: FC<Props> = ({ beansData }) => {
  const noData = !beansData?.length;

  if (noData) {
    return <DashboardNoData />;
  }

  const renderCards = () => {
    return beansData.map((bean, i) => (
      <Card key={`dashboard-card-${i}`} data={bean} />
    ));
  };

  return (
    <ScrollView bgC="$screenBackground" flex={1} pl="$8" pt="$4" pr="$8">
      {renderCards()}
    </ScrollView>
  );
};
export default DashboardCards;
