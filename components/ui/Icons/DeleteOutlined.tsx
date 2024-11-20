import { FC } from "react";
import Svg, { G, Path, Defs, Rect, ClipPath } from "react-native-svg";

interface Props {
  color: string;
  size?: number;
}
const DeleteOutlinedIcon: FC<Props> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <G clip-path="url(#clip0_6_12257)">
      <Path
        d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_6_12257">
        <Rect width={size} height={size} fill={color} />
      </ClipPath>
    </Defs>
  </Svg>
);

export default DeleteOutlinedIcon;
