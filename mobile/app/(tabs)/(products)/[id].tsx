import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import useCart from "@/store/cartStore";
import { HeartIcon } from "lucide-react-native";
import { useFavorite } from "@/store/favoriteStore";
import { cn } from "@/utils/utils";
import { fetchProductById } from "@/api/products";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.deleteProduct);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);
  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorite((state) => state.items);

  const isInCart = cartItems.some((item) => item.product.id === parseInt(id));
  const isInFavorite = favoriteItems.some(
    (item) => item.product.id === parseInt(id)
  );

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(Number(id)),
  });

  const addToCart = () => {
    addProduct(product);
  };

  const deleteFromCart = () => {
    deleteProduct(product);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>!!!Error in fetch product</Text>;
  }

  return (
    <Box className="flex-1 items-center p-3">
      <Stack.Screen options={{ title: product?.name }} />
      <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1 relative">
        <Image
          source={{
            uri: product.image,
          }}
          className="mb-6 h-[240px] w-full rounded-md"
          alt={`${product.name} image`}
          resizeMode="contain"
        />
        <Button
          onPress={() => toggleFavorite(product)}
          className="absolute top-2 right-4"
          variant="link"
        >
          <ButtonIcon
            className={cn(isInFavorite && "text-red-500")}
            as={HeartIcon}
          />
        </Button>
        <Text className="text-sm font-normal mb-2 text-typography-700">
          {product.name}
        </Text>
        <VStack className="mb-6">
          <Heading size="md" className="mb-4">
            ${product.price}
          </Heading>
          <Text size="sm">{product.description}</Text>
        </VStack>
        <Box className="flex-col sm:flex-row">
          <Button
            action={isInCart ? "negative" : "primary"}
            onPress={isInCart ? deleteFromCart : addToCart}
            className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1"
          >
            <ButtonText size="sm">
              {isInCart ? "Delete from cart" : "Add to cart"}
            </ButtonText>
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductDetailsScreen;
