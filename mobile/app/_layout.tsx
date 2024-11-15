import "@/global.css";

import { Pressable } from "react-native";
import { Link, Redirect, Stack, Tabs, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCart,
  ShoppingCartIcon,
  User,
  UserIcon,
} from "lucide-react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import useCart from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { useFavorite } from "@/store/favoriteStore";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

const queryClient = new QueryClient();

export default function RootLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const favoriteItemsNum = useFavorite((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        {/* <Stack
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
          <Stack.Screen name="(auth)/register" options={{ title: "Sign up" }} />
          <Stack.Screen
            name="product/[id]"
            options={{ title: "Product details" }}
          />
          <Stack.Screen name="cart" options={{ title: "Cart" }} />
        </Stack> */}
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",

              tabBarIcon: () => <Icon as={HomeIcon} />,
            }}
          />
          <Tabs.Screen
            name="(auth)/login"
            options={{
              title: "Login",
              tabBarIcon: () => <Icon as={UserIcon} />,
              href: isLoggedIn ? null : "(auth)/login",
            }}
          />
          <Tabs.Screen
            name="(auth)/register"
            options={{
              title: "Sign up",
              tabBarIcon: () => <Icon as={UserIcon} />,
              href: null,
            }}
          />
          <Tabs.Screen
            name="product/[id]"
            options={{
              href: null,
              headerLeft: () => (
                <Button
                  variant="link"
                  className="text-black"
                  onPress={() => router.back()}
                >
                  <ButtonIcon as={ChevronLeftIcon} />
                  <ButtonText>Back</ButtonText>
                </Button>
              ),
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: "Cart",
              tabBarIcon: () => <Icon as={ShoppingCartIcon} />,
              tabBarBadge: cartItemsNum > 0 ? cartItemsNum : undefined,
              headerLeft: () => (
                <Button
                  variant="link"
                  className="text-black"
                  onPress={() => router.back()}
                >
                  <ButtonIcon as={ChevronLeftIcon} />
                  <ButtonText>Back</ButtonText>
                </Button>
              ),
            }}
          />
          <Tabs.Screen
            name="favorites"
            options={{
              title: "Favorites",
              tabBarIcon: () => <Icon as={HeartIcon} />,
              tabBarBadge: favoriteItemsNum > 0 ? favoriteItemsNum : undefined,
              headerLeft: () => (
                <Button
                  variant="link"
                  className="text-black"
                  onPress={() => router.back()}
                >
                  <ButtonIcon as={ChevronLeftIcon} />
                  <ButtonText>Back</ButtonText>
                </Button>
              ),
            }}
          />
        </Tabs>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
