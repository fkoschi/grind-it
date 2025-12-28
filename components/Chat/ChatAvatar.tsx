import { Avatar } from "tamagui";
import { User, Bot } from "@tamagui/lucide-icons";

interface ChatAvatarProps {
  type: "user" | "bot";
  image?: string;
}

export const ChatAvatar = ({ type, image }: ChatAvatarProps) => {
  return (
    <Avatar circular size="$4">
      {image ? (
        <Avatar.Image src={image} />
      ) : (
        <Avatar.Fallback
          backgroundColor={type === "user" ? "$gray4" : "$primary"}
          alignItems="center"
          justifyContent="center"
        >
          {type === "user" ? (
            <User color="$gray2" size="$2" />
          ) : (
            <Bot color="$white" size="$2" />
          )}
        </Avatar.Fallback>
      )}
    </Avatar>
  );
};
