import { SafeAreaView } from "react-native";
import { HomeIcon, ShieldAlert } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { HStack } from "./ui/hstack";

const ErrorScreen = ({ errorText }: { errorText: string }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <HStack className="items-center mb-4" space="sm">
        <Icon as={ShieldAlert} className="text-red-500 size-6" />
        <Text className="text-red-500 font-bold" size="lg">
          {errorText}
        </Text>
      </HStack>
      <Button
        className="flex items-center gap-2 border"
        onPress={() => router.navigate("/")}
      >
        <ButtonIcon
          className="text-zinc-700 dark:text-zinc-300"
          as={HomeIcon}
        />
        <ButtonText className="text-zinc-700 dark:text-zinc-300">
          Go home screen
        </ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default ErrorScreen;
