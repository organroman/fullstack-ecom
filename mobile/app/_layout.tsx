import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import "@/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Shop" }} />
          <Stack.Screen
            name="product/[id]"
            options={{ title: "Product details" }}
          />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
