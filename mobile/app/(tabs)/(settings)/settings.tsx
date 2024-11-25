import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
// import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/store/authStore";
import { Link, Redirect } from "expo-router";
import {
  BarcodeIcon,
  ListOrderedIcon,
  Rows4Icon,
  UserIcon,
} from "lucide-react-native";
import { SafeAreaView, Image, View } from "react-native";

const SettingsGeneralScreen = () => {
  // const isLoggedIn = useAuth((s) => !!s.token);

  // if (!isLoggedIn) {
  //   return <Redirect href="(tabs)" />;
  // }

  return (
    <SafeAreaView>
      <HStack className="border-b  border-blue-500 p-2">
        <Image
          source={require("../../../assets/logo.png")}
          alt="logo"
          style={{ width: 40, height: 40, objectFit: "contain" }}
        />
      </HStack>
      <VStack className="border-b border-blue-500 p-2 py-4 gap-3">
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
      </VStack>
    </SafeAreaView>
  );
};

export default SettingsGeneralScreen;
