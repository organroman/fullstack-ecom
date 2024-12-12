import { Stack } from "expo-router";

export default function ProductsLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: "Products",
          headerShown: false,
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
