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
    <Card className="p-2 rounded-lg  bg-zinc-800 flex-1 border border-zinc-600 shadow-soft-">
      <Link href={`/(products)/${product.id}`} asChild>
        <Pressable className="min-h-[200]">
          <Image
            source={{
              uri: product.images[0].image_link,
            }}
            className="mb-2 h-[220px] aspect-square  rounded-md"
            alt={`${product.name} image`}
            // resizeMode="contain"
          />
        </Pressable>
      </Link>
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {product.name}
      </Text>
      <Heading size="md" className="mb-4">
        ${product.price}
      </Heading>
      <HStack className="justify-between w-full pb-2">
        <Button
          onPress={isInCart ? deleteFromCart : addToCart}
          className="min-w-[100px] bg-zinc-900 border border-zinc-800"
        >
          <ButtonText className="text-slate-100">
            {isInCart ? "Remove" : "Buy"}
          </ButtonText>
        </Button>
        <Button onPress={() => toggleFavorites(product)} variant="link">
          <ButtonIcon
            className={cn("text-slate-300", isInFavorite && "text-blue-500")}
            as={HeartIcon}
          />
        </Button>
      </HStack>
    </Card>
  );
};

export default ProductListItem;
