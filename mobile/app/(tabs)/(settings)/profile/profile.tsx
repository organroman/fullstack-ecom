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

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current?.();
    }
  };
  if (!isLoggedIn || !user) {
    return <Redirect href="home" />;
  }

  const updateUserMutation: UseMutationResult<
    any,
    Error,
    UpdateUserSchema,
    unknown
  > = useMutation({
    mutationFn: async ({ name, email, phone, address }: UpdateUserSchema) => {
      const id = user.id;
      const data = await updateUser(id, name, email, phone, address);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      handleEditMode();
    },
    onError: (error) => console.log(error),
  });

  return (
    <SafeAreaView>
      <VStack>
        <VStack className=" py-2 px-4 bg-neutral-100 border-b border-blue-300 gap-1">
          <HStack className="items-center justify-between w-full  ">
            <Button variant="link" onPress={() => router.back()}>
              <ButtonIcon as={ChevronLeftIcon} size="lg" className="w-6 h-6" />
            </Button>
            <Button
              variant="link"
              onPress={() => (editMode ? handleSave() : handleEditMode())}
              isDisabled={updateUserMutation.isPending}
            >
              <ButtonText>{editMode ? "Save" : "Edit"} </ButtonText>
            </Button>
          </HStack>
          <Heading>My profile</Heading>
        </VStack>

        <VStack className="py-2">
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
      </VStack>
    </SafeAreaView>
  );
}
