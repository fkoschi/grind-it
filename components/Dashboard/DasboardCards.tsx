import { CoffeeBean } from "@/types";
import { FC } from "react";
import { Animated } from "react-native";
import { ScrollView } from "tamagui";
import Card from "@/components/ui/Card/Card";
import DashboardNoData from "./DashboardNoData";
import { useStaggeredReveal } from "@/hooks/useStaggeredReveal";

interface Props {
  beansData?: CoffeeBean[];
}
const DashboardCards: FC<Props> = ({ beansData }) => {
  const noData = !beansData?.length;
  const { getAnimatedStyle } = useStaggeredReveal({ itemCount: beansData?.length ?? 0 });

  if (noData) {
    return <DashboardNoData />;
  }

  const renderCards = () =>
    beansData.map((bean, index) => (
      <Animated.View key={`dashboard-card-${bean.id ?? index}`} style={getAnimatedStyle(index)}>
        <Card data={bean} />
      </Animated.View>
    ));

  return (
    <ScrollView bgC="$screenBackground" flex={1} pl="$8" pt="$4" pr="$8">
      {renderCards()}
    </ScrollView>
  );
};
export default DashboardCards;
