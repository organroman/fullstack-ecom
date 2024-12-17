import { useTheme } from "@/components/ui/ThemeProvider";
import { bgColor } from "@/utils/constants";
import { Stack } from "expo-router";

export default function CategoriesLayout() {
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
        name="index"
        options={{
          title: "Categories",
        }}
      />
    </Stack>
  );
}
