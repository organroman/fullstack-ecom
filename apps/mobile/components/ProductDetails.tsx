import { Product, ProductImage } from "@/types/types";

import { ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react-native";

import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";
import { Image } from "./ui/image";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { Box } from "./ui/box";

import useCart from "@/store/cartStore";
import { useFavorite } from "@/store/favoriteStore";

import { cn } from "@/utils/utils";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.deleteProduct);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);

  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorite((state) => state.items);

  const isInCart = cartItems?.some((item) => item.product?.id === product?.id);
  const isInFavorite = favoriteItems?.some(
    (item) => item.product.id === product.id
  );

  const [imageToShow, setImageToShow] = useState<ProductImage | null>(null);

  useEffect(() => {
    setImageToShow(product.images[0]);
  }, [product]);

  const addToCart = () => {
    addProduct(product);
  };

  const deleteFromCart = () => {
    deleteProduct(product);
  };

  return (
    <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1 justify-between relative bg-neutral-200 dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-600">
      <VStack>
        <Image
          source={{
            uri: imageToShow?.image_link || "",
          }}
          className="w-full h-[200px] self-center rounded-lg mb-6"
          alt={`${product.name} image`}
          resizeMode="contain"
        />
        <Button
          onPress={() => toggleFavorite(product)}
          className="absolute top-2 right-4"
          variant="link"
        >
          <ButtonIcon
            className={cn(isInFavorite && "text-blue-500")}
            as={HeartIcon}
          />
        </Button>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16,
            marginBottom: 16,
          }}
        >
          {product.images?.map((image: ProductImage) => (
            <Pressable
              key={image?.id}
              onPress={() => setImageToShow(image)}
              className={cn(
                "border-[0.5px] border-blue-500 p-2 rounded-lg w-[84px] aspect-square items-center justify-center",
                imageToShow?.id === image.id && "border-blue-700 border"
              )}
            >
              <Image
                source={{
                  uri: image.image_link,
                }}
                className={cn("object-cover w-[72px] aspect-square")}
                alt={product.name}
              />
            </Pressable>
          ))}
        </ScrollView>

        <Text className="text-xl font-normal mb-1 text-zinc-700 dark:text-zinc-300">
          {product.name}
        </Text>
        <VStack className="mb-4">
          <Heading size="xl" className="mb-2">
            ${product.price}
          </Heading>
          <ScrollView
            className="max-h-[180px]"
            showsVerticalScrollIndicator={false}
          >
            <Text size="md">{product.description}</Text>
          </ScrollView>
        </VStack>
      </VStack>
      <Box className="flex-col sm:flex-row">
        <Button
          onPress={isInCart ? deleteFromCart : addToCart}
          className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1 border"
        >
          <ButtonText size="sm" className="text-zinc-700 dark:text-zinc-200">
            {isInCart ? "Delete from cart" : "Add to cart"}
          </ButtonText>
        </Button>
      </Box>
    </Card>
  );
};

export default ProductDetails;
