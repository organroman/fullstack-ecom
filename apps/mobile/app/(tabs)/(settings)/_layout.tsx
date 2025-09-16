import { Stack } from "expo-router";

import { useTheme } from "@/components/ui/ThemeProvider";

import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

export default function SettingsLayout() {
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
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="(orders)"
        options={{
          title: "My orders",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(profile)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
