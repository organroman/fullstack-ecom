import { View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import ProductDetails from "@/components/ProductDetails";

import { useGetProductById } from "@/api/products/useGetProductById";

import { cn } from "@/utils/utils";

const OrderProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();

  const { data, isLoading, error } = useGetProductById(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorScreen errorText="Failed to load product" />;
  }

  return (
    <View className={cn("flex-1 p-2")} style={{ marginBottom: bottom }}>
      <ProductDetails product={data?.product} />
    </View>
  );
};

export default OrderProductDetails;
