import { Product } from "@/types/types";

import { Pressable } from "react-native";
import { Link } from "expo-router";
import { HeartIcon } from "lucide-react-native";

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useTheme } from "./ui/ThemeProvider";

import { HStack } from "./ui/hstack";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { VStack } from "./ui/vstack";

import useCart from "@/store/cartStore";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";
import { BG_ACCENT_COLOR } from "@/utils/constants";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const { theme } = useTheme();

  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.deleteProduct);
  const toggleFavorites = useFavorite((state) => state.toggleProduct);
  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorite((state) => state.items);

  const isInCart = cartItems.some((item) => item.product.id === product.id);
  const isInFavorite = favoriteItems.some(
    (item) => item.product.id === product.id
  );

  const addToCart = () => {
    addProduct(product);
  };

  const deleteFromCart = () => {
    deleteProduct(product);
  };

  return (
    <Card
      className={cn(
        "p-2 rounded-lg flex-1 border border-neutral-300 dark:border-zinc-600 shadow-soft-1 justify-between bg-neutral-200 dark:bg-zinc-800",
        BG_ACCENT_COLOR(theme)
      )}
    >
      <Link href={`/(products)/${product.id}`} asChild>
        <Pressable className="min-h-[200]">
          <Image
            source={{
              uri: product.images[0].image_link,
            }}
            className="mb-2 h-[220px] aspect-square  rounded-md"
            alt={`${product.name} image`}
            resizeMode="contain"
          />
        </Pressable>
      </Link>
      <Text className="text-sm font-normal mb-2 text-zinc-700 dark:text-zinc-400">
        {product.name}
      </Text>
      <VStack>
        <Heading size="md" className="mb-4">
          ${product.price}
        </Heading>
        <HStack className="justify-between w-full pb-2">
          <Button
            onPress={isInCart ? deleteFromCart : addToCart}
            className="min-w-[100px] border"
          >
            <ButtonText className="text-zinc-700 dark:text-zinc-200">
              {isInCart ? "Remove" : "Buy"}
            </ButtonText>
          </Button>
          <Button onPress={() => toggleFavorites(product)} variant="link">
            <ButtonIcon
              className={cn(isInFavorite && "text-blue-500")}
              as={HeartIcon}
            />
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default ProductListItem;
