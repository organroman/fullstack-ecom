import { Pressable, Text } from "react-native";
import {
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

import { CartItem } from "@/types/types";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";
import { Link, useSegments } from "expo-router";
import React from "react";

interface CartItemProps {
  item: CartItem;
  page: "cart" | "favorites" | "checkout";
}

const CartProduct = ({ item, page }: CartItemProps) => {
  const addProduct = useCart((state) => state.addProduct);
  const increaseQuantity = useCart((s) => s.increaseProductQuantity);
  const decreaseQuantity = useCart((s) => s.decreaseProductQuantity);
  const deleteProduct = useCart((s) => s.deleteProduct);
  const cartItems = useCart((s) => s.items);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);
  const isInBasket = cartItems.some((p) => p.product.id === item.product.id);

  const segments = useSegments();

  const isCartScreen = segments.includes("cart");

  return (
    <HStack
      className={cn(
        "bg-neutral-200 dark:bg-zinc-800 border border-neutral-400 dark:border-zinc-600 rounded-md p-4 py-2 w-full items-start justify-between relative",
        page === "checkout" && "p-1"
      )}
    >
      <Link href={`/(products)/${item.product.id}`} asChild>
        <Pressable>
          <HStack space="sm">
            <Image
              source={{
                uri: item.product?.images[0]?.image_link,
              }}
              className="mr-2 h-[80px] rounded-md"
              alt={`${item.product.name} image`}
              resizeMode="contain"
            />
            <VStack space="md" className="justify-start">
              <Text className="font-bold max-w-[200px] text-zinc-700 dark:text-slate-200">
                {item.product.name}
              </Text>
              <HStack space="md" className="items-center">
                <Text className="text-zinc-700 dark:text-zinc-300">
                  ${item.product.price}
                </Text>
                {page === "cart" && (
                  <>
                    <HStack space="sm" className="items-center">
                      <Button
                        isDisabled={item.quantity === 1}
                        onPress={() => decreaseQuantity(item)}
                        size="xs"
                        className="p-1 h-6 bg-zinc-300 dark:bg-zinc-950"
                      >
                        <ButtonIcon
                          as={MinusIcon}
                          className="text-zinc-700 dark:text-zinc-300"
                        />
                      </Button>
                      <Text className="ml-auto text-zinc-700 dark:text-zinc-300">
                        {item.quantity}
                      </Text>
                      <Button
                        size="xs"
                        className="p-1 h-6 bg-zinc-300 dark:bg-zinc-950 "
                        onPress={() => increaseQuantity(item)}
                      >
                        <ButtonIcon
                          as={PlusIcon}
                          className="text-zinc-700 dark:text-zinc-300"
                        />
                      </Button>
                    </HStack>
                  </>
                )}
              </HStack>
            </VStack>
          </HStack>
        </Pressable>
      </Link>
      {page !== "checkout" && (
        <Button
          onPress={() =>
            isCartScreen
              ? deleteProduct(item.product)
              : toggleFavorite(item.product)
          }
          size="md"
          variant="link"
          className="absolute top-0 right-2 z-10"
        >
          <ButtonIcon as={XIcon} />
        </Button>
      )}
      {page === "favorites" && (
        <Button
          className="absolute bottom-2 right-2 border"
          onPress={() =>
            isInBasket ? deleteProduct(item.product) : addProduct(item.product)
          }
        >
          <ButtonIcon
            as={ShoppingCartIcon}
            className={cn(
              "text-zinc-700 dark:text-zinc-300",
              isInBasket && "text-blue-500 dark:text-blue-500"
            )}
          />
          <ButtonText
            className={cn(
              "text-zinc-700 dark:text-zinc-300",
              isInBasket && "text-blue-500 dark:text-blue-500"
            )}
          >
            {isInBasket ? "Remove" : "Buy"}
          </ButtonText>
        </Button>
      )}
      <VStack className="relative items-end justify-start gap-2"></VStack>
    </HStack>
  );
};

export default CartProduct;
