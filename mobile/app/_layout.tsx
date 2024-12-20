import "@/global.css";

import { Theme } from "@/types/types";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { BG_ACCENT_COLOR, BG_COLOR } from "@/utils/constants";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    (async () => {
      const savedTheme = (await AsyncStorage.getItem("theme")) as Theme;
      if (savedTheme) {
        setTheme(savedTheme || "dark");
      }
    })();
  }, []);

  if (theme === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GluestackUIProvider mode={theme}>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: BG_COLOR(theme),
              },
              headerStyle: {
                backgroundColor: BG_ACCENT_COLOR(theme),
              },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </GluestackUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
