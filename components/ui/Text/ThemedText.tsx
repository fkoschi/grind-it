import { ComponentProps, FC } from "react";
import { Text } from "tamagui";

interface Props extends ComponentProps<typeof Text> {
  fw: 300 | 400 | 500 | 600 | 700 | 800 | 900;
}
const ThemedText: FC<Props> = ({ fw, children, ...props }) => {
  let fontFamily = "";

  if (fw === 300) fontFamily = "DarkerGrotesque_300Light";
  else if (fw === 400) fontFamily = "DarkerGrotesque_400Regular";
  else if (fw === 500) fontFamily = "DarkerGrotesque_500Medium";
  else if (fw === 600) fontFamily = "DarkerGrotesque_600SemiBold";
  else if (fw === 700) fontFamily = "DarkerGrotesque_700Bold";
  else if (fw === 800) fontFamily = "DarkerGrotesque_800ExtraBold";
  else if (fw === 900) fontFamily = "DarkerGrotesque_900Black";

  return (
    <Text fontFamily={fontFamily} {...props}>
      {children}
    </Text>
  );
};
export default ThemedText;
