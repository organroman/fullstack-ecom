import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          //   headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign up",
        }}
      />
    </Stack>
  );
}
