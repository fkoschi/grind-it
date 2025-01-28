import { CoffeeBean } from "@/types";
import { FC } from "react";
import { ScrollView } from "tamagui";
import Card from "@/components/ui/Card/Card";
import DashboardNoData from "./DashboardNoData";
import CardSkeleton from "../ui/Card/Card.Skeleton";

interface Props {
  loading: boolean;
  beansData?: CoffeeBean[];
}
const DashboardCards: FC<Props> = ({ loading, beansData }) => {
  const noData = !beansData?.length;

  if (noData) {
    return <DashboardNoData />;
  }

  const renderCards = () => {
    if (loading) {
      return <CardSkeleton />;
    }

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
