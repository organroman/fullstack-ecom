import { Stack } from "expo-router";

export default function CategoriesLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
