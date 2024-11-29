import { HeartIcon } from "lucide-react-native";

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Product } from "@/types/types";
import { HStack } from "./ui/hstack";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import useCart from "@/store/cartStore";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.addProduct);
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
    <Card className="p-5 rounded-lg flex-1 border shadow-soft-1 border-neutral-100">
      <Link href={`/(products)/${product.id}`} asChild>
        <Pressable className="flex-1">
          <Image
            source={{
              uri: product.image,
            }}
            className="mb-6 h-[240px] w-full rounded-md"
            alt={`${product.name} image`}
            resizeMode="contain"
          />
        </Pressable>
      </Link>
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {product.name}
      </Text>
      <Heading size="md" className="mb-4">
        ${product.price}
      </Heading>
      <HStack className="justify-between w-full">
        <Button
          onPress={isInCart ? deleteFromCart : addToCart}
          className="min-w-[100px]"
        >
          <ButtonText>{isInCart ? "Remove" : "Buy"}</ButtonText>
        </Button>
        <Button onPress={() => toggleFavorites(product)} variant="link">
          <ButtonIcon
            className={cn(isInFavorite && "text-red-500")}
            as={HeartIcon}
          />
        </Button>
      </HStack>
    </Card>
  );
};

export default ProductListItem;
