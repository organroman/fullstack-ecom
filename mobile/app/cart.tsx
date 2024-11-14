import { FlatList } from "react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import useCart from "@/store/cartStore";

export default function Cart() {
  const items = useCart((state) => state.items);

  const resetCart = useCart((state) => state.resetCart);

  const onCheckout = async () => {
    resetCart();
  };

  if (items.length === 0) {
    return (
      <VStack className="p-4 items-center justify-center h-full gap-4">
        <Text className="font-bold">Your cart is empty</Text>
        <Text>But it&apos;s always not to late to fill it</Text>
        <Link href="/" asChild>
          <Button>
            <ButtonText>In the shop</ButtonText>
          </Button>
        </Link>
      </VStack>
    );
  }

  return (
    <FlatList
      data={items}
      contentContainerClassName="gap-2 mx-auto w-full max-w-[960px] p-2"
      renderItem={({ item }) => (
        <HStack className="bg-white p-4 ">
          <VStack space="sm">
            <Text className="font-bold">{item.product.name}</Text>
            <Text>${item.product.price}</Text>
          </VStack>
          <Text className="ml-auto">{item.quantity}</Text>
        </HStack>
      )}
      ListFooterComponent={() => (
        <Button onPress={onCheckout}>
          <ButtonText>Checkout</ButtonText>
        </Button>
      )}
    />
  );
}
