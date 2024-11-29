import "@/global.css";

import { Tabs, useRouter } from "expo-router";
import {
  ChevronLeftIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
  UserCog,
  UserIcon,
} from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import useCart from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";

export default function TabsLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const favoriteItemsNum = useFavorite((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);

  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Home",
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <Icon
              className={cn("text-black", focused && "text-blue-500")}
              as={HomeIcon}
            />
          ),
          // href: "(products)/index",
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <Icon
              className={cn("text-black", focused && "text-blue-500")}
              as={ShoppingCartIcon}
            />
          ),
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
          tabBarIcon: ({ focused }) => (
            <Icon
              className={cn("text-black", focused && "text-blue-500")}
              as={HeartIcon}
            />
          ),
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
      <Tabs.Screen
        name="(auth)"
        options={{
          title: "Login",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              className={cn("text-black", focused && "text-blue-500")}
              as={UserIcon}
            />
          ),
          href: isLoggedIn ? null : "(auth)/login",
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "More",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              className={cn("text-black", focused && "text-blue-500")}
              as={UserCog}
            />
          ),
          href: isLoggedIn ? "(settings)/settings" : null,
        }}
      />
    </Tabs>
  );
}
