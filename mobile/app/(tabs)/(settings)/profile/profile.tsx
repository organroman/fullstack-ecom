import { SafeAreaView } from "react-native";
import React, { useRef, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";

import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

import ProfileInfo from "@/components/ProfileInfo";
import UserUpdateForm from "@/components/UserUpdateForm";

import { useAuth } from "@/store/authStore";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { UpdateUserSchema } from "@/types/types";
import { updateUser } from "@/api/users";

export default function ProfileScreen() {
  const router = useRouter();

  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const isLoggedIn = useAuth((s) => !!s.token);

  const [editMode, setEditMode] = useState(false);
  const formSubmitRef = useRef<() => void | null>(null);

  const updateUserMutation: UseMutationResult<
    any,
    Error,
    UpdateUserSchema,
    unknown
  > = useMutation({
    mutationFn: async ({ name, email, phone, address }: UpdateUserSchema) => {
      if (!user?.id) {
        throw new Error("User id is missing");
      }
      const data = await updateUser(user.id, name, email, phone, address);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      handleEditMode();
    },
    onError: (error) => console.log(error),
  });

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current?.();
    }
  };

  if (!isLoggedIn || !user) {
    return <Redirect href="(products)" />;
  }

  return (
    <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1">
      <VStack className="h-full bg-white dark:bg-black flex-shrink-0">
        {/* <VStack className="p-4 border-b-[0.5px] border-blue-500 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0"> */}
        <HStack className="p-4 items-center justify-between w-full border-b-[0.5px] border-blue-500">
          <Button variant="link" onPress={() => router.back()}>
            <ButtonIcon as={ChevronLeftIcon} size="lg" className="w-6 h-6" />
          </Button>
          <Heading>My profile</Heading>
          <Button
            variant="link"
            onPress={() => (editMode ? handleSave() : handleEditMode())}
            isDisabled={updateUserMutation.isPending}
          >
            <ButtonText>{editMode ? "Save" : "Edit"} </ButtonText>
          </Button>
        </HStack>
        {editMode ? (
          <UserUpdateForm
            currentInfo={user}
            onFormSubmit={(submit) => {
              //@ts-ignore
              formSubmitRef.current = submit;
            }}
            updateUserMutation={updateUserMutation}
          />
        ) : (
          <ProfileInfo user={user} />
        )}
      </VStack>

      <VStack className="py-2">{/* </VStack> */}</VStack>
    </SafeAreaView>
  );
}
