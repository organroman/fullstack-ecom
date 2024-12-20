
import { ChevronLeftIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Button, ButtonIcon, ButtonText } from "./ui/button";


const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="link" action="primary" onPress={() => router.back()}>
      <ButtonIcon as={ChevronLeftIcon} />
      <ButtonText>Back</ButtonText>
    </Button>
  );
};

export default BackButton;
