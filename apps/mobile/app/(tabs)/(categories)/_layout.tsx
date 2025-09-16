import { useTheme } from "@/components/ui/ThemeProvider";
import { Stack } from "expo-router";

export default function CategoriesLayout() {
  const { theme } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
        }}
      />
    </Stack>
  );
}
