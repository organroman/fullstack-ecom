import { useAuth } from "@/store/authStore";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={
        {
          // headerShown: false,
          //   headerStyle: {
          //     backgroundColor: "#f4511e",
          //   },
          //   headerTintColor: "#fff",
          //   headerTitleStyle: {
          //     fontWeight: "bold",
          //   },
        }
      }
    >
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
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
