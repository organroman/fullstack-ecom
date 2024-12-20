import { SafeAreaView } from "react-native";
import { HomeIcon, ShieldAlert } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

const ErrorScreen = ({ errorText }: { errorText: string }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Icon as={ShieldAlert} className="text-red-500 size-6" />
      <Text className="text-red-500" size="lg">
        {errorText}
      </Text>
      <Button
        className="flex items-center gap-2"
        variant="solid"
        onPress={() => router.navigate("/")}
      >
        <ButtonIcon as={HomeIcon} />
        <ButtonText>Go home screen</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default ErrorScreen;
