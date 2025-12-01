import { FC } from "react";
import { View, styled } from "tamagui";
import { Image } from "expo-image";
import { User } from "@tamagui/lucide-icons"; // Fallback or alternative

interface ChatAvatarProps {
  type: "user" | "bot";
  image?: string;
}

const AvatarContainer = styled(View, {
  width: 40,
  height: 40,
  borderRadius: 20,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "$backgroundStrong", // Default background
  variants: {
    type: {
      user: {
        backgroundColor: "$secondary",
      },
      bot: {
        backgroundColor: "$primary",
      },
    },
  } as const,
});

export const ChatAvatar: FC<ChatAvatarProps> = ({ type, image }) => {
  if (image) {
    return (
      <AvatarContainer type={type}>
        <Image source={{ uri: image }} style={{ width: 40, height: 40 }} />
      </AvatarContainer>
    );
  }

  return (
    <AvatarContainer type={type}>
      {type === "user" ? (
        <User size={24} color="white" />
      ) : (
        // Placeholder for Bot, maybe a different icon or just text for now if no icon
        <User size={24} color="white" />
      )}
    </AvatarContainer>
  );
};
