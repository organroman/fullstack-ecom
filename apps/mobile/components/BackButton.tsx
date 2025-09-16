import { ChevronLeftIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Button, ButtonIcon, ButtonText } from "./ui/button";
interface BackButtonProps {
  size?: "md" | "sm" | "lg" | "xl" | "xs";
  iconStyles?: string;
  textStyles?: string;
  text: string;
}

const BackButton = ({
  size = "lg",
  iconStyles = "size-10 text-blue-500",
  textStyles = "text-lg text-blue-500 dark:text-blue-500",
  text = "Back",
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <Button variant="link" onPress={() => router.back()}>
      <ButtonIcon as={ChevronLeftIcon} size={size} className={iconStyles} />
      <ButtonText className={textStyles}>{text}</ButtonText>
    </Button>
  );
};

export default BackButton;
