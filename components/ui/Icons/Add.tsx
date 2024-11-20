import { FC } from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

interface Props {
  size?: number;
}
const AddIcon: FC<Props> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <G clip-path="url(#clip0_6_8865)">
      <Path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white" />
    </G>
    <Defs>
      <ClipPath id="clip0_6_8865">
        <Rect width={size} height={size} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default AddIcon;
