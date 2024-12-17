import { useTheme } from "@/components/ui/ThemeProvider";
import { bgColor } from "@/utils/constants";
import { Stack } from "expo-router";

export default function ProductsLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: bgColor(theme),
        },
        headerStyle: {
          backgroundColor: bgColor(theme),
        },
      }}
    >
      <Stack.Screen
        name="products"
        options={{
          title: "Products",

          headerShown: false,
          // headerSearchBarOptions: {
          //   placeholder: "Search",
          //   tintColor: "red",
          // },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Product",
        }}
      />
    </Stack>
  );
}
