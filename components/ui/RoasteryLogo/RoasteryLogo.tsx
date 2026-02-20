import { FC, useState } from "react";
import { Image } from "expo-image";
import { View } from "tamagui";

interface RoasteryLogoProps {
  websiteUrl: string;
  size?: number;
}

const extractDomain = (url: string): string | null => {
  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

const RoasteryLogo: FC<RoasteryLogoProps> = ({ websiteUrl, size = 64 }) => {
  const [hasError, setHasError] = useState(false);

  const domain = extractDomain(websiteUrl);
  const token = process.env.EXPO_PUBLIC_LOGODEV_TOKEN;

  if (!domain || !token || hasError) return null;

  const logoUrl = `https://img.logo.dev/${domain}?token=${token}&size=128&format=png&retina=true&greyscale=false`;

  return (
    <View
      width={size}
      height={size}
      borderRadius={size / 4}
      overflow="hidden"
      bgC="transparent"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Image
        source={{ uri: logoUrl }}
        style={{ width: size, height: size }}
        contentFit="contain"
        onError={() => setHasError(true)}
      />
    </View>
  );
};

export default RoasteryLogo;
