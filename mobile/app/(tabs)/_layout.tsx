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
import { cn } from "@/utils/utils";
import { useTheme } from "@/components/ui/ThemeProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import config from "@/tailwind.config";
import { Text } from "@/components/ui/text";

export default function TabsLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const favoriteItemsNum = useFavorite((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);
  const router = useRouter();
  const { theme } = useTheme();

  const tailwind = resolveConfig(config);

  const bgColor =
    theme === "dark"
      ? tailwind.theme.colors.zinc[900]
      : tailwind.theme.colors.zinc[100];

  const borderColor = tailwind.theme.colors.blue[500];

  const getIconColor = (focused?: boolean) => {
    return cn(
      "text-zinc-700 dark:text-zinc-400 ",
      focused && "text-blue-500 dark:text-blue-500"
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: "red",
        },
      }}
    >
      <Tabs.Screen
        name="(categories)"
        options={{
          title: "Categories",

          headerShown: false,
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={LogsIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          headerShown: false,
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={HomeIcon} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={ShoppingCartIcon} />
          ),
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),
          tabBarBadge: cartItemsNum > 0 ? cartItemsNum : undefined,
          headerLeft: () => (
            <Button
              variant="link"
              className={getIconColor()}
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
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={HeartIcon} />
          ),
          tabBarBadge: favoriteItemsNum > 0 ? favoriteItemsNum : undefined,
          headerLeft: () => (
            <Button
              variant="link"
              className={getIconColor()}
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
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={UserIcon} />
          ),
          href: isLoggedIn ? null : "(auth)/login",
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "More",
          tabBarLabel: (props) => (
            <Text className={cn("text-xs", getIconColor(props.focused))}>
              {props.children}
            </Text>
          ),

          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon className={getIconColor(focused)} as={UserCog} />
          ),
          href: isLoggedIn ? "(settings)/settings" : null,
        }}
      />
    </Tabs>
  );
}
