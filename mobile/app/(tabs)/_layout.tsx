import "@/global.css";

import { Tabs } from "expo-router";
import {
  HeartIcon,
  HomeIcon,
  LogsIcon,
  ShoppingCartIcon,
  UserCog,
  UserIcon,
} from "lucide-react-native";

import { Icon } from "@/components/ui/icon";

import { useTheme } from "@/components/ui/ThemeProvider";

import useCart from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { useFavorite } from "@/store/favoriteStore";

import { BG_ACCENT_COLOR, BORDER_COLOR, TEXT_COLOR } from "@/utils/constants";

export default function TabsLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const favoriteItemsNum = useFavorite((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);
  const { theme } = useTheme();

  const getIconColor = (focused?: boolean) => {
    return focused ? BORDER_COLOR : TEXT_COLOR(theme);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: BG_ACCENT_COLOR(theme),
          borderTopColor: BORDER_COLOR,
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: BG_ACCENT_COLOR(theme),
        },
        headerTitleStyle: {
          color: TEXT_COLOR(theme),
        },

        tabBarInactiveTintColor: TEXT_COLOR(theme),
        tabBarActiveTintColor: BORDER_COLOR,
      }}
    >
      <Tabs.Screen
        name="(categories)"
        options={{
          title: "Categories",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={LogsIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={HomeIcon} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={ShoppingCartIcon} />
          ),
          tabBarBadge: cartItemsNum > 0 ? cartItemsNum : undefined,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Wish List",
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={HeartIcon} />
          ),
          tabBarBadge: favoriteItemsNum > 0 ? favoriteItemsNum : undefined,
        }}
      />
      <Tabs.Screen
        name="(auth)"
        options={{
          title: "Login",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={UserIcon} />
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
            <Icon color={getIconColor(focused)} as={UserCog} />
          ),
          href: isLoggedIn ? "(settings)" : null,
        }}
      />
    </Tabs>
  );
}
