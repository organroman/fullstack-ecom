import { Stack } from "expo-router";

import { useTheme } from "@/components/ui/ThemeProvider";
import { BG_ACCENT_COLOR, BG_COLOR } from "@/utils/constants";
import BackButton from "@/components/BackButton";

export default function ProductsLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: BG_ACCENT_COLOR(theme),
        },
        contentStyle: {
          backgroundColor: BG_COLOR(theme),
        },
      }}
    >
      <Stack.Screen
        name="products"
        options={{
          title: "Products",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Product",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="filter"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
