import { FC } from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

const CheckIcon: FC = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G clip-path="url(#clip0_46_1208)">
        <Path
          d="M8.99997 16.1701L4.82997 12.0001L3.40997 13.4101L8.99997 19.0001L21 7.00009L19.59 5.59009L8.99997 16.1701Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_46_1208">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CheckIcon;
