import { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { getTokenValue } from "tamagui";

interface Props {
  active?: boolean;
}
const HomeIcon: FC<Props> = ({ active = false }) => {
  const color = active ? getTokenValue("$primary") : "#A2A2A2";
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill={color}>
      <Path
        d="M19.08 6.01002L12.53 0.770018C11.25 -0.249982 9.25 -0.259982 7.98 0.760018L1.43 6.01002C0.490001 6.76002 -0.0799989 8.26002 0.120001 9.44002L1.38 16.98C1.67 18.67 3.24 20 4.95 20H15.55C17.24 20 18.84 18.64 19.13 16.97L20.39 9.43002C20.57 8.26002 20 6.76002 19.08 6.01002ZM11 16C11 16.41 10.66 16.75 10.25 16.75C9.84 16.75 9.5 16.41 9.5 16V13C9.5 12.59 9.84 12.25 10.25 12.25C10.66 12.25 11 12.59 11 13V16Z"
        fill={color}
      />
    </Svg>
  );
};
export default HomeIcon;
