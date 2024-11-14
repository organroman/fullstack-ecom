import "@/global.css";

import { Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShoppingCart, User } from "lucide-react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import useCart from "@/store/cartStore";
import { useAuth } from "@/store/authStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack
          screenOptions={{
            headerRight: () => (
              <Link href="/cart" asChild>
                <Pressable className="flex flex-row gap-2">
                  <Icon as={ShoppingCart} />
                  {cartItemsNum > 0 && <Text>{cartItemsNum}</Text>}
                </Pressable>
              </Link>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Shop",
              headerLeft: () =>
                !isLoggedIn && (
                  <Link href="/login" asChild>
                    <Pressable className="flex flex-row gap-2">
                      <Icon as={User} />
                    </Pressable>
                  </Link>
                ),
            }}
          />
          <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
          <Stack.Screen
            name="product/[id]"
            options={{ title: "Product details" }}
          />
          <Stack.Screen name="cart" options={{ title: "Cart" }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
