import { Pressable, Text } from "react-native";
import {
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  XIcon,
} from "lucide-react-native";

import { HStack } from "./ui/hstack";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

import useCart from "@/store/cartStore";

import { ICartItem, Product } from "@/types/types";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";
import { Link, useSegments } from "expo-router";

interface CartItemProps {
  item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const addProduct = useCart((state) => state.addProduct);
  const increaseQuantity = useCart((s) => s.increaseProductQuantity);
  const decreaseQuantity = useCart((s) => s.decreaseProductQuantity);
  const deleteProduct = useCart((s) => s.deleteProduct);
  const favoritesItems = useFavorite((s) => s.items);
  const cartItems = useCart((s) => s.items);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);
  const isInBasket = cartItems.some((p) => p.product.id === item.product.id);
  const isFavorite = favoritesItems.some(
    (i) => i.product.id === item.product.id
  );

  const segments = useSegments();

  return (
    <HStack className="bg-white p-4 w-full items-center justify-between relative">
      <Link href={`/product/${item.product.id}`} asChild>
        <Pressable>
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
              <Text className="font-bold max-w-[240px]">
                {item.product.name}
              </Text>
              <Text>${item.product.price}</Text>
            </VStack>
          </HStack>
        </Pressable>
      </Link>
      <VStack className="relative items-end justify-start gap-2">
        {segments.includes("cart") && (
          <>
            <Button
              onPress={() => deleteProduct(item.product)}
              size="md"
              variant="link"
            >
              <ButtonIcon as={XIcon} />
            </Button>

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
          </>
        )}
        <Button variant="link" onPress={() => toggleFavorite(item.product)}>
          <ButtonIcon
            as={HeartIcon}
            className={cn(isFavorite && "text-red-500")}
          />
        </Button>
        {segments.includes("favorites") && (
          <Button
            variant="link"
            onPress={() =>
              isInBasket
                ? deleteProduct(item.product)
                : addProduct(item.product)
            }
          >
            <ButtonIcon
              as={ShoppingCartIcon}
              className={cn(isInBasket && "text-red-500")}
            />
          </Button>
        )}
      </VStack>
    </HStack>
  );
};

export default CartItem;
