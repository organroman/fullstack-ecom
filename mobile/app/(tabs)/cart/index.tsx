import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import CartItem from "@/components/CartProduct";
import Empty from "@/components/Empty";

import useCart from "@/store/cartStore";

export default function Cart() {
  const router = useRouter();
  const items = useCart((state) => state.items);

  const totalAmount = items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  const onMakeOrder = async () => {
    router.push({ pathname: "/cart/checkout" });
  };

  if (items.length === 0) {
    return (
      <Empty
        title="Your cart is empty"
        desc="But it's always not too late to fill it"
        href="/(products)"
        linkText="Go to the shop"
      />
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={items}
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName="gap-2 mx-auto w-full max-w-[960px] p-2"
        renderItem={({ item }) => <CartItem item={item} page="cart" />}
        ListFooterComponent={() => (
          <VStack space="sm">
            <Text className="font-bold">Total: ${totalAmount}</Text>
            <Button onPress={onMakeOrder} className="border">
              <ButtonText className="text-zinc-700 dark:text-zinc-300">
                Make order
              </ButtonText>
            </Button>
          </VStack>
        )}
      />
    </View>
  );
}
