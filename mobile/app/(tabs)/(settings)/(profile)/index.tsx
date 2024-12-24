import { User } from "@/types/types";

import { SafeAreaView } from "react-native";
import React, { useRef, useState } from "react";
import { Redirect, Stack } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

import ProfileInfo from "@/components/ProfileInfo";
import UserUpdateForm from "@/components/UserUpdateForm";
import BackButton from "@/components/BackButton";

import { useAuth } from "@/store/authStore";

import { useUpdateUser } from "@/api/users/useUpdateUser";

export default function ProfileScreen() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const isLoggedIn = useAuth((s) => !!s.token);

  const [editMode, setEditMode] = useState(false);
  const formSubmitRef = useRef<() => void | null>(null);

  if (!isLoggedIn || !user) {
    return <Redirect href="/" />;
  }

  const { updateUserMutation } = useUpdateUser(user);

  const handleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleOnSuccess = (data: User) => {
    setUser(data);
    handleEditMode();
  };

  const handleSave = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current?.();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Profile",
          headerLeft: () => <BackButton text="Settings" />,
          headerRight: () => (
            <Button
              variant="link"
              onPress={() => (editMode ? handleSave() : handleEditMode())}
              isDisabled={updateUserMutation.isPending}
            >
              <ButtonText>{editMode ? "Save" : "Edit"} </ButtonText>
            </Button>
          ),
        }}
      />
      <SafeAreaView className="flex-1">
        <VStack className="h-full flex-shrink-0 p-2 mt-4">
          {editMode ? (
            <UserUpdateForm
              currentInfo={user}
              onFormSubmit={(submit) => {
                //@ts-ignore
                formSubmitRef.current = submit;
              }}
              updateUserMutation={updateUserMutation}
              handleOnSuccess={(data) => handleOnSuccess(data)}
            />
          ) : (
            <ProfileInfo user={user} />
          )}
        </VStack>
      </SafeAreaView>
    </>
  );
}
