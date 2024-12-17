import { Stack } from "expo-router";

import { useTheme } from "@/components/ui/ThemeProvider";

import { bgColor } from "@/utils/constants";

export default function SettingsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: bgColor(theme),
        },
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders/my-orders"
        options={{
          title: "My orders",
        }}
      />
      <Stack.Screen
        name="orders/[id]"
        options={{
          title: "Order",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/change-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
