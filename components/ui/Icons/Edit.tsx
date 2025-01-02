import { FC } from "react";
import Svg, { G, Path, Defs, Rect, ClipPath } from "react-native-svg";

interface Props {
  size?: number;
  fillColor?: string;
}
const EditIcon: FC<Props> = ({ size = 24, fillColor = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G clip-path="url(#clip0_46_1314)">
      <Path
        d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z"
        fill={fillColor}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_46_1314">
        <Rect width={size} height={size} fill={fillColor} />
      </ClipPath>
    </Defs>
  </Svg>
);

export default EditIcon;
