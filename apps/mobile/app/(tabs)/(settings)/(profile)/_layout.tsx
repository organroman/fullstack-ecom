import React from "react";
import { Stack } from "expo-router";

import { useTheme } from "@/components/ui/ThemeProvider";
import BackButton from "@/components/BackButton";

import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

const ProfileLayout = () => {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: BG_COLOR(theme),
        },
        headerStyle: {
          backgroundColor: BG_ACCENT_COLOR(theme),
        },
        headerTitleStyle: {
          color: TEXT_COLOR(theme),
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          title: "Change Password",
          headerLeft: () => <BackButton text="My Profile" />,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
