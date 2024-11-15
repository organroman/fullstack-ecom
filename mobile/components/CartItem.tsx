import { Text } from "react-native";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react-native";

import { HStack } from "./ui/hstack";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import { Button, ButtonIcon } from "./ui/button";

import useCart from "@/store/cartStore";

import { ICartItem } from "@/types/types";

interface CartItemProps {
  item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const increaseQuantity = useCart((s) => s.increaseProductQuantity);
  const decreaseQuantity = useCart((s) => s.decreaseProductQuantity);
  const deleteProduct = useCart((s) => s.deleteProduct);

  return (
    <HStack className="bg-white p-4 w-full items-center justify-between relative">
      <HStack space="sm">
        <Image
          source={{
            uri: item.product.image,
          }}
          className="mr-2 h-[80px] rounded-md"
          alt={`${item.product.name} image`}
          resizeMode="contain"
        />
        <VStack space="sm" className="justify-center">
          <Text className="font-bold max-w-[240px]">{item.product.name}</Text>
          <Text>${item.product.price}</Text>
        </VStack>
      </HStack>
      <HStack space="sm" className="items-center">
        <Button
          isDisabled={item.quantity === 1}
          onPress={() => decreaseQuantity(item)}
          size="xs"
          className="p-1 h-6"
        >
          <ButtonIcon as={MinusIcon} />
        </Button>
        <Text className="ml-auto">{item.quantity}</Text>
        <Button
          size="xs"
          className="p-1 h-6"
          onPress={() => increaseQuantity(item)}
        >
          <ButtonIcon as={PlusIcon} />
        </Button>
      </HStack>
      <Button
        onPress={() => deleteProduct(item.product)}
        size="md"
        variant="link"
        className="absolute top-2 right-2 p-1 h-6"
      >
        <ButtonIcon as={XIcon} />
      </Button>
    </HStack>
  );
};

export default CartItem;
