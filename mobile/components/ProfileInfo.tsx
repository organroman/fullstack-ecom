import { Text } from "react-native";

import { VStack } from "./ui/vstack";
import { Button, ButtonText } from "./ui/button";

import { useAuth } from "@/store/authStore";

import { User } from "@/types/types";
import { useRouter } from "expo-router";

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const removeToken = useAuth((s) => s.removeToken);
  const removeUser = useAuth((s) => s.removeUser);
  const router = useRouter();

  const handleLogOut = () => {
    removeToken();
    removeUser();
  };

  return (
    <VStack className="">
      <VStack
        className="py-2 px-2 border-b border-neutral-300 dark:text-zinc-900"
        space="xs"
      >
        <Text className="text-neutral-500 dark:text-neutral-400 text-2xs">
          Name
        </Text>
        <Text className="text-zinc-700 dark:text-zinc-300 text-lg">
          {user?.name}
        </Text>
      </VStack>
      <VStack
        className="py-2 px-2 border-b border-neutral-300 dark:text-zinc-900"
        space="xs"
      >
        <Text className="text-neutral-500 dark:text-neutral-400 text-2xs">
          Email
        </Text>
        <Text className="text-zinc-700 dark:text-zinc-300 text-lg">
          {user?.email}
        </Text>
      </VStack>
      <VStack
        className="py-2 px-2 border-b border-neutral-300 dark:text-zinc-900"
        space="xs"
      >
        <Text className="text-neutral-500 dark:text-neutral-400 text-2xs">
          Phone
        </Text>
        <Text className="text-zinc-700 dark:text-zinc-300 text-lg">
          {user?.phone || "-"}
        </Text>
      </VStack>
      <VStack
        className="py-2 px-2 border-b border-neutral-300 dark:text-zinc-900"
        space="xs"
      >
        <Text className="text-neutral-500 dark:text-neutral-400 text-2xs">
          Address
        </Text>
        <Text className="text-zinc-700 dark:text-zinc-300 text-lg">
          {user?.address || "-"}
        </Text>
      </VStack>

      <VStack className="px-4 py-6 gap-3">
        <Button
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(settings)/(profile)/password",
            })
          }
          className="bg-transparent dark:bg-transparent border"
        >
          <ButtonText className="text-zinc-700 dark:text-zinc-300">
            Change password?
          </ButtonText>
        </Button>
        <Button onPress={handleLogOut} className="border">
          <ButtonText className="text-zinc-700 dark:text-zinc-300">
            Log out
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default ProfileInfo;
