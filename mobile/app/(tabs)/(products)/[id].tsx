import React from "react";
import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react-native";

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import { useTheme } from "@/components/ui/ThemeProvider";

import { useFavorite } from "@/store/favoriteStore";
import useCart from "@/store/cartStore";

import { fetchProductById } from "@/api/products";
import { cn } from "@/utils/utils";
import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

import { ProductImage } from "@/types/types";



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
    return <Loading />;
  }

  if (error) {
    return <ErrorScreen errorText="Failed to load product" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.product.name || "Product details",
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
          },
          headerStyle: {
            backgroundColor: BG_ACCENT_COLOR(theme),
          },
          headerTitleStyle: {
            color: TEXT_COLOR(theme),
          },
          headerTintColor: TEXT_COLOR(theme),
        }}
      />
      <View className="flex-1 items-center p-3">
        <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1 justify-between relative bg-neutral-200 dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-600">
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

            <Text className="text-xl font-normal mb-1 text-zinc-700 dark:text-zinc-300">
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
              onPress={isInCart ? deleteFromCart : addToCart}
              className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1 border"
            >
              <ButtonText
                size="sm"
                className="text-zinc-700 dark:text-zinc-200"
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
