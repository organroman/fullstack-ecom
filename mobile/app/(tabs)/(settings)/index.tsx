import React from "react";
import { Image, View } from "react-native";
import { Redirect, Stack, useRouter } from "expo-router";
import { MoonIcon, Rows4Icon, SunIcon, UserIcon } from "lucide-react-native";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useTheme } from "@/components/ui/ThemeProvider";

import { useAuth } from "@/store/authStore";

const SettingsGeneralScreen = () => {
  const isLoggedIn = useAuth((s) => !!s.token);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HStack className="items-center" space="md">
              <Image
                source={require("../../../assets/logo.png")}
                alt="logo"
                style={{ width: 40, height: 40, objectFit: "contain" }}
              />
              <Text className="text-3xl text-zinc-700 dark:text-zinc-300">
                E-comm
              </Text>
            </HStack>
          ),
        }}
      />

      <View className="flex-1">
        <VStack className="h-full p-2 py-4" space="sm">
          <Button
            variant="link"
            onPress={() => router.push("/(profile)")}
            className="w-full items-center justify-start"
          >
            <ButtonIcon as={UserIcon} className="text-blue-500" />
            <ButtonText className="text-zinc-700 dark:text-zinc-300">
              My Profile
            </ButtonText>
          </Button>
          <Button
            variant="link"
            onPress={() => router.push("/(orders)")}
            className="w-full items-center justify-start"
          >
            <ButtonIcon as={Rows4Icon} className="text-blue-500" />
            <ButtonText className="text-zinc-700 dark:text-zinc-300">
              My Orders
            </ButtonText>
          </Button>
          <Button
            variant="link"
            className="flex flex-row justify-start"
            onPress={toggleTheme}
          >
            <ButtonIcon
              as={theme === "dark" ? MoonIcon : SunIcon}
              className="text-blue-500"
            />
            <ButtonText className="text-zinc-700 dark:text-zinc-300">
              Change theme
            </ButtonText>
          </Button>
        </VStack>
      </View>
    </>
  );
};

export default SettingsGeneralScreen;
