import "@/global.css";

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@/types/types";

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
          <Stack>
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
