import { User } from "@/types/types";
import { View } from "react-native";
import React, { useRef } from "react";
import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/store/authStore";
import { useUpdateUser } from "@/api/users/useUpdateUser";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import UserUpdateForm from "@/components/UserUpdateForm";

const UpdateContactsScreen = () => {
  const { user } = useAuth();
  const setUser = useAuth((s) => s.setUser);
  const router = useRouter();
  const formSubmitRef = useRef<() => void | null>(null);

  if (!user) {
    return <Redirect href="(products)" />;
  }

  const { updateUserMutation } = useUpdateUser(user);

  const handleSave = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current?.();
    }
  };
  const handleOnSuccess = (data: User) => {
    setUser(data);
    router.dismiss();
  };

  return (
    <View>
      <UserUpdateForm
        currentInfo={user}
        onFormSubmit={(submit) => {
          //@ts-ignore
          formSubmitRef.current = submit;
        }}
        updateUserMutation={updateUserMutation}
        handleOnSuccess={(data) => handleOnSuccess(data)}
      />
      <HStack className="px-4 gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1"
          onPress={() => router.dismiss()}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button className="border flex-1" onPress={handleSave}>
          <ButtonText className="text-zinc-700 dark:text-zinc-300">
            Save
          </ButtonText>
        </Button>
      </HStack>
    </View>
  );
};

export default UpdateContactsScreen;
