import { FlatList, View } from "react-native";
import { Link } from "expo-router";
import { useMutation } from "@tanstack/react-query";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import CartItem from "@/components/CartItem";

import useCart from "@/store/cartStore";
import { createOrder } from "@/api/orders";

export default function Cart() {
  const items = useCart((state) => state.items);

  const resetCart = useCart((state) => state.resetCart);

  const totalAmount = items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  const createOrderMutation = useMutation({
    mutationFn: () =>
      createOrder(
        items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }))
      ),
    onSuccess: (data) => {
      resetCart();
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onCheckout = async () => {
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <VStack className="p-4 items-center justify-center h-full gap-4">
        <Text className="font-bold">Your cart is empty</Text>
        <Text>But it&apos;s always not to late to fill it</Text>
        <Link href="/" asChild>
          <Button>
            <ButtonText>Go to the shop</ButtonText>
          </Button>
        </Link>
      </VStack>
    );
  }

  return (
    <View className="flex-1 h-full">
      <FlatList
        data={items}
        contentContainerClassName="gap-2 mx-auto w-full max-w-[960px] p-2 flex-1"
        renderItem={({ item }) => <CartItem item={item} />}
        ListFooterComponent={() => (
          <VStack space="sm">
            <Text className="font-bold">Total: ${totalAmount}</Text>
            <Button onPress={onCheckout}>
              <ButtonText>Checkout</ButtonText>
            </Button>
          </VStack>
        )}
      />
    </View>
  );
}
