import { Stack, useRouter } from "expo-router";
import { XIcon } from "lucide-react-native";

import { Button, ButtonIcon } from "@/components/ui/button";

import { useTheme } from "@/components/ui/ThemeProvider";
import BackButton from "@/components/BackButton";

import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

const OrdersLayout = () => {
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
          title: "My Orders",
          headerLeft: () => <BackButton text="Settings" />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Order details",
          headerLeft: () => <BackButton text="My orders" />,
        }}
      />
      <Stack.Screen
        name="product-details"
        options={{
          title: "Product details",
          presentation: "modal",
          headerLeft: () => (
            <Button variant="link" onPress={() => router.dismiss()}>
              <ButtonIcon
                as={XIcon}
                className="text-blue-500 dark:text-blue-500"
              />
            </Button>
          ),
        }}
      />
    </Stack>
  );
};

export default OrdersLayout;
