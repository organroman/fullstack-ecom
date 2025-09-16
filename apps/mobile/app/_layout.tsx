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
const DEFAULT_THEME: Theme = "light"; // <- pick your default

export default function RootLayout() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME); // <- not null

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
          setTheme(saved as Theme);
        }
      } catch (e) {
        console.log("theme load error", e);
      }
    })();
  }, []);

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
