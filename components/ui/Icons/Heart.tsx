import { FC } from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  fill?: string;
  strokeColor?: string;
}
const HeartIcon: FC<Props> = ({ fill, size, strokeColor }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 20" fill={fill}>
      <Path
        d="M19.8401 2.61012C19.3294 2.09912 18.7229 1.69376 18.0555 1.4172C17.388 1.14064 16.6726 0.998291 15.9501 0.998291C15.2276 0.998291 14.5122 1.14064 13.8448 1.4172C13.1773 1.69376 12.5709 2.09912 12.0601 2.61012L11.0001 3.67012L9.94012 2.61012C8.90843 1.57842 7.50915 0.998826 6.05012 0.998826C4.59109 0.998826 3.19181 1.57842 2.16012 2.61012C1.12843 3.64181 0.548828 5.04108 0.548828 6.50012C0.548828 7.95915 1.12843 9.35842 2.16012 10.3901L11.0001 19.2301L19.8401 10.3901C20.3511 9.87936 20.7565 9.27293 21.033 8.60547C21.3096 7.93801 21.4519 7.2226 21.4519 6.50012C21.4519 5.77763 21.3096 5.06222 21.033 4.39476C20.7565 3.7273 20.3511 3.12087 19.8401 2.61012Z"
        stroke={strokeColor ? strokeColor : fill}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
export default HeartIcon;
