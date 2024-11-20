import React, { FC } from "react";
import Svg, { Path } from "react-native-svg";
import { getTokenValue, useCurrentColor } from "tamagui";

interface Props {
  active: boolean;
}
const ProfileIcon: FC<Props> = ({ active }) => {
  const color = active ? getTokenValue("$primary") : "#A2A2A2";

  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill={color}>
      <Path
        d="M12.91 10.87C12.81 10.86 12.69 10.86 12.58 10.87C10.2 10.79 8.31 8.84 8.31 6.44C8.31 3.99 10.29 2 12.75 2C15.2 2 17.19 3.99 17.19 6.44C17.18 8.84 15.29 10.79 12.91 10.87Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M7.91 14.56C5.49 16.18 5.49 18.82 7.91 20.43C10.66 22.27 15.17 22.27 17.92 20.43C20.34 18.81 20.34 16.17 17.92 14.56C15.18 12.73 10.67 12.73 7.91 14.56Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ProfileIcon;
