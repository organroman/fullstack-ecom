import { View, Text } from "react-native";

import { VStack } from "./ui/vstack";
import { Button, ButtonText } from "./ui/button";

import { useAuth } from "@/store/authStore";

import { IUser } from "@/types/types";
import { Link } from "expo-router";

interface ProfileInfoProps {
  user: IUser;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const removeToken = useAuth((s) => s.removeToken);
  const removeUser = useAuth((s) => s.removeUser);

  const handleLogOut = () => {
    removeToken();
    removeUser();
  };

  return (
    <VStack className="">
      <VStack className="py-2 px-4 border-b border-zinc-500 gap-1">
        <Text className="text-zinc-700 dark:text-slate-300 text-2xs">Name</Text>
        <Text className="text-zinc-700 dark:text-slate-100 text-lg">
          {user?.name}
        </Text>
      </VStack>
      <VStack className="py-2 px-4 border-b border-zinc-500 gap-1">
        <Text className="text-zinc-700 dark:text-slate-300 text-2xs">
          Email
        </Text>
        <Text className="text-zinc-700 dark:text-slate-100 text-lg">
          {user?.email}
        </Text>
      </VStack>
      <VStack className="py-2 px-4 border-b border-zinc-500 gap-1">
        <Text className="text-zinc-700 dark:text-slate-300 text-2xs">
          Phone
        </Text>
        <Text className="text-zinc-700 dark:text-slate-100 text-lg">
          {user?.phone || "-"}
        </Text>
      </VStack>
      <VStack className="py-2 px-4 border-b border-zinc-500 gap-1">
        <Text className="text-zinc-700 dark:text-slate-300 text-2xs">
          Address
        </Text>
        <Text className="text-zinc-700 dark:text-slate-100 text-lg">
          {user?.address || "-"}
        </Text>
      </VStack>

      <VStack className="px-4 py-6 gap-3">
        <Link href="profile/change-password" asChild>
          <Button variant="link">
            <ButtonText>Change password?</ButtonText>
          </Button>
        </Link>
        <Button action="negative" onPress={handleLogOut}>
          <ButtonText className="dark:text-slate-100">Log out</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default ProfileInfo;
