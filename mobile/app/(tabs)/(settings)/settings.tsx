import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import { Text } from "@/components/ui/text";
import { useTheme } from "@/components/ui/ThemeProvider";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/store/authStore";
import { Link, Redirect, useRouter } from "expo-router";
import { MoonIcon, Rows4Icon, SunIcon, UserIcon } from "lucide-react-native";
import { SafeAreaView, Image, View } from "react-native";

const SettingsGeneralScreen = () => {
  const isLoggedIn = useAuth((s) => !!s.token);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  if (!isLoggedIn) {
    return <Redirect href="(products)" />;
  }

  return (
    <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1">
      <View className="h-full bg-white dark:bg-black">
        <HStack className="border-b-[0.5px] border-blue-500 p-4  bg-zinc-100 dark:bg-zinc-900 items-center gap-4 flex-shrink-0">
          <Image
            source={require("../../../assets/logo.png")}
            alt="logo"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          <Text className="text-3xl">E-comm</Text>
        </HStack>
        <VStack className="border-b h-full border-blue-500 p-2 py-4 gap-4">
          <Link
            href="/profile/profile"
            className="flex items-center justify-start"
            asChild
          >
            <Button variant="link">
              <ButtonIcon as={UserIcon} className="text-blue-500" />
              <ButtonText>My Profile</ButtonText>
            </Button>
          </Link>
          <Link
            href="/orders/my-orders"
            className="flex items-center justify-start"
            asChild
          >
            <Button variant="link">
              <ButtonIcon as={Rows4Icon} className="text-blue-500" />
              <ButtonText>My Orders</ButtonText>
            </Button>
          </Link>
          <Button
            variant="link"
            className="flex flex-row justify-start"
            onPress={toggleTheme}
          >
            <ButtonIcon
              as={theme === "dark" ? MoonIcon : SunIcon}
              className="text-blue-500"
            />
            <ButtonText>Change theme</ButtonText>
          </Button>
        </VStack>
      </View>
    </SafeAreaView>
  );
};

export default SettingsGeneralScreen;
