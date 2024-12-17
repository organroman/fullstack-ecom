import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
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
import { bgColor, headerColorText } from "@/utils/constants";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Product, ProductImage } from "@/types/types";
import { useEffect, useState } from "react";
import React from "react";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  const addProduct = useCart((state) => state.addProduct);
  const deleteProduct = useCart((state) => state.deleteProduct);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);
  const cartItems = useCart((state) => state.items);
  const favoriteItems = useFavorite((state) => state.items);
  const [imageToShow, setImageToShow] = useState<ProductImage | null>(null);

  const isInCart = cartItems.some((item) => item.product.id === parseInt(id));
  const isInFavorite = favoriteItems.some(
    (item) => item.product.id === parseInt(id)
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(Number(id)),
  });

  useEffect(() => {
    data && setImageToShow(data?.product.images[0]);
  }, [data]);

  const addToCart = () => {
    addProduct(data.product);
  };

  const deleteFromCart = () => {
    deleteProduct(data.product);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>!!!Error in fetch product</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.product.name || "Product details",
          contentStyle: {
            backgroundColor: bgColor(theme),
          },
          headerStyle: {
            backgroundColor: bgColor(theme),
          },
          headerTitleStyle: {
            color: headerColorText(theme),
          },
          headerTintColor: headerColorText(theme),
        }}
      />
      <View className="flex-1 items-center p-3 bg-black">
        <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1 justify-between relative bg-zinc-400 dark:bg-zinc-800 border border-zinc-600">
          <VStack>
            <Image
              source={{
                uri: imageToShow?.image_link || "",
              }}
              className="w-full h-[200px] self-center rounded-lg mb-6"
              alt={`${data.product.name} image`}
              resizeMode="contain"
            />
            <Button
              onPress={() => toggleFavorite(data.product)}
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
              {data.product.images.map((image: ProductImage) => (
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
                    alt={data?.product.name}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <Text className="text-xl font-normal mb-1 text-zinc-700 dark:text-zinc-200">
              {data.product.name}
            </Text>
            <VStack className="mb-4">
              <Heading size="xl" className="mb-2">
                ${data.product.price}
              </Heading>
              <ScrollView
                className="max-h-[180px]"
                showsVerticalScrollIndicator={false}
              >
                <Text size="md">{data.product.description}</Text>
              </ScrollView>
            </VStack>
          </VStack>
          <Box className="flex-col sm:flex-row">
            <Button
              action={isInCart ? "negative" : "primary"}
              onPress={isInCart ? deleteFromCart : addToCart}
              className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1 bg-slate-400 dark:bg-zinc-900 border border-slate-600 dark:border-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300"
            >
              <ButtonText
                size="sm"
                className="dark:text-slate-100 text-slate-700"
              >
                {isInCart ? "Delete from cart" : "Add to cart"}
              </ButtonText>
            </Button>
          </Box>
        </Card>
      </View>
    </>
  );
};

export default ProductDetailsScreen;
