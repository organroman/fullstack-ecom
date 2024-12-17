import "@/global.css";

import { Tabs, useRouter } from "expo-router";
import {
  ChevronLeftIcon,
  HeartIcon,
  HomeIcon,
  LogsIcon,
  ShoppingCartIcon,
  UserCog,
  UserIcon,
} from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import useCart from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { useFavorite } from "@/store/favoriteStore";
import { useTheme } from "@/components/ui/ThemeProvider";

import {
  bgColor,
  borderColor,
  headerColorText,
  tabBarColor,
  tabBarColorActive,
} from "@/utils/constants";

export default function TabsLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const favoriteItemsNum = useFavorite((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);
  const router = useRouter();
  const { theme } = useTheme();

  const getIconColor = (focused?: boolean) => {
    return focused ? tabBarColorActive : tabBarColor(theme);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: bgColor(theme),
          borderTopColor: borderColor,
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: bgColor(theme),
        },

        tabBarInactiveTintColor: tabBarColor(theme),
        tabBarActiveTintColor: tabBarColorActive,
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
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={ShoppingCartIcon} />
          ),
          tabBarBadge: cartItemsNum > 0 ? cartItemsNum : undefined,
          headerLeft: () => (
            <Button
              variant="link"
              className={headerColorText(theme)}
              onPress={() => router.back()}
            >
              <ButtonIcon
                as={ChevronLeftIcon}
                className={headerColorText(theme)}
              />
              <ButtonText className={headerColorText(theme)}>Back</ButtonText>
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Icon color={getIconColor(focused)} as={HeartIcon} />
          ),
          tabBarBadge: favoriteItemsNum > 0 ? favoriteItemsNum : undefined,
          headerLeft: () => (
            <Button
              variant="link"
              className={headerColorText(theme)}
              onPress={() => router.back()}
            >
              <ButtonIcon
                as={ChevronLeftIcon}
                className={headerColorText(theme)}
              />
              <ButtonText className={headerColorText(theme)}>Back</ButtonText>
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
          href: isLoggedIn ? "(settings)/settings" : null,
        }}
      />
    </Tabs>
  );
}
