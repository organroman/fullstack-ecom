
import {Stack } from "expo-router";


export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="orders/my-orders"
        options={{
          title: "My orders",
        }}
      />
      <Stack.Screen
        name="orders/[id]"
        options={{
          title: "Order",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/change-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
