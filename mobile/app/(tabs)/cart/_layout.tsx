import { Stack, useRouter } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { useTheme } from "@/components/ui/ThemeProvider";

import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

export default function CartLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: BG_COLOR(theme),
        },
        headerStyle: {
          backgroundColor: BG_ACCENT_COLOR(theme),
        },
        headerTitleStyle: {
          color: TEXT_COLOR(theme),
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Cart",
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
          },
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: "Checkout",
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
          },

          presentation: "modal",
          headerLeft: () => (
            <Button variant="link" onPress={() => router.dismiss()}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="update-contacts"
        options={{
          title: "Update contact details",
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
          },

          presentation: "modal",
        }}
      />
    </Stack>
  );
}
