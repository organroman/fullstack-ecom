import { Order } from "@/types/types";

import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { CircleCheckBigIcon, Edit2Icon, Loader } from "lucide-react-native";
import { Redirect, useRouter } from "expo-router";

import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import CartItem from "@/components/CartProduct";

import { useAuth } from "@/store/authStore";
import useCart from "@/store/cartStore";

import { useCreateOrder } from "@/api/orders/useCreateOrder";
import { cn } from "@/utils/utils";

const CheckoutScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

  const [isOrderCreated, setIsOrderCreated] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  if (!user) {
    return <Redirect href={"/"} />;
  }
  const handleOnSuccess = (data: Order) => {
    resetCart();
    setIsOrderCreated(true);
    setCreatedOrderId(data.id.toString());
  };

  const goToTheOrder = () => {
    router.replace({
      pathname: `(tabs)/(settings)/(orders)/${createdOrderId}`,
    });
    setTimeout(() => router.dismissAll(), 0);
  };

  const goHome = () => {
    router.push({ pathname: "/(tabs)/(categories)/" });
    setTimeout(() => router.dismissAll(), 0);
  };

  const { createOrderMutation } = useCreateOrder({
    handleOnSuccess: handleOnSuccess,
  });

  const totalAmount = items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  const handleCheckout = () => {
    createOrderMutation.mutate({
      items: items,
      deliveryAddress: user?.address,
      phone: user?.phone,
    });
  };

  if (isOrderCreated) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-4 ">
        <VStack className="items-center mb-14 px-4" space="lg">
          <CircleCheckBigIcon size={56} />
          <Text className="text-zinc-700 dark:text-zinc-300 text-3xl">
            Your order №: {createdOrderId}
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-400 text-xl">
            Thank you for choosing Ecomm
          </Text>
          <HStack className="items-center mt-6" space="lg">
            <Button size="lg" className="border flex-1" onPress={goToTheOrder}>
              <ButtonText className="text-zinc-700 dark:text-zinc-300">
                Check your order
              </ButtonText>
            </Button>

            <Button size="lg" className="border flex-1" onPress={goHome}>
              <ButtonText>To the shop</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </SafeAreaView>
    );
  }
  return (
    <View className="flex-1 relative">
      <ScrollView className="p-2 mb-[94px]">
        <Heading className="self-center">The last step</Heading>
        <VStack className="mt-4" space="sm">
          <Heading size="sm">Contact details</Heading>
          <VStack
            className="p-2 rounded-md bg-neutral-200 dark:bg-zinc-800 relative"
            space="xs"
          >
            <Text
              className={cn(
                "text-zinc-700 dark:text-zinc-300",
                !user?.name && "text-red-500"
              )}
            >
              Name: {user?.name}
            </Text>
            <Text
              className={cn(
                "text-zinc-700 dark:text-zinc-300",
                !user?.email && "text-red-500"
              )}
            >
              Email: {user?.email}
            </Text>
            <Text
              className={cn(
                "text-zinc-700 dark:text-zinc-300",
                !user?.phone && "text-red-500"
              )}
            >
              Phone: {user?.phone || "-"}
            </Text>
            <Text
              className={cn(
                "text-zinc-700 dark:text-zinc-300",
                !user?.address && "text-red-500"
              )}
            >
              Delivery address: {user?.address || "-"}
            </Text>
            <Button
              variant="link"
              size="sm"
              className="absolute top-1 right-2"
              onPress={() => router.push("/cart/update-contacts")}
            >
              <ButtonIcon
                as={Edit2Icon}
                className="text-zinc-700 dark:text-zinc-300"
              />
            </Button>
          </VStack>
          <VStack className="mt-4 mb-2" space="sm">
            <Heading size="sm">Products</Heading>
            <VStack
              className="p-2 rounded-md bg-neutral-200 dark:bg-zinc-800 relative"
              space="xs"
            >
              {items.map((item) => (
                <CartItem key={item.product.id} page="checkout" item={item} />
              ))}
              <HStack className="mt-2 justify-between items-center">
                <Text className="font-bold text-zinc-700 dark:text-zinc-300 text-lg">
                  Total: ${totalAmount}
                </Text>
                <Button variant="link" onPress={() => router.dismiss()}>
                  <ButtonText className="text-zinc-700 dark:text-zinc-300">
                    Back to cart
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
      <HStack className="px-4 absolute bottom-12 left-0 w-full ">
        <Button
          className="w-full border"
          disabled={!user?.address || !user?.phone}
          onPress={handleCheckout}
        >
          {createOrderMutation.isPending && (
            <ButtonIcon
              as={Loader}
              className="text-zinc-700 dark:text-zinc-300"
            />
          )}
          <ButtonText className="text-zinc-700 dark:text-zinc-300">
            {createOrderMutation.isPending ? "Wait" : "Checkout"}
          </ButtonText>
        </Button>
      </HStack>
    </View>
  );
};

export default CheckoutScreen;
