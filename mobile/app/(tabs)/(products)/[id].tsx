import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import { useTheme } from "@/components/ui/ThemeProvider";

import ProductDetails from "@/components/ProductDetails";

import { useGetProductById } from "@/api/products/useGetProductById";
import { BG_ACCENT_COLOR, BG_COLOR, TEXT_COLOR } from "@/utils/constants";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  const { data, isLoading, error } = useGetProductById(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorScreen errorText="Failed to load product" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Product details",
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
        <ProductDetails product={data.product} />
      </View>
    </>
  );
};

export default ProductDetailsScreen;
