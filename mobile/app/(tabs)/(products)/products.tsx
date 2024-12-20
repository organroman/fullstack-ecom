import React from "react";
import { ActivityIndicator, View, FlatList, SafeAreaView } from "react-native";
import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LogsIcon } from "lucide-react-native";

import { useInfiniteProducts } from "@/api/products/queries";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";

import ProductListItem from "@/components/ProductListItem";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";

import { useDebounce } from "@/utils/utils";
import {
  BAR_TINT_COLOR,
  BORDER_COLOR,
  SEARCH_BAR_TEXT_COLOR,
  TEXT_COLOR,
} from "@/utils/constants";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function ProductsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchPhrase, setSearchPhrase] = useState("");
  const { categoryId } = useLocalSearchParams();

  const debouncedSearchPhrase = useDebounce(searchPhrase, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    searchPhrase: debouncedSearchPhrase,
    categoryId: categoryId ? (categoryId as string) : undefined,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorScreen errorText="Failed to load products" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              variant="link"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(products)/filter",
                  params: { categoryId },
                })
              }
            >
              <ButtonIcon as={LogsIcon} />
            </Button>
          ),
          headerTitleStyle: {
            color: TEXT_COLOR(theme),
          },
          headerSearchBarOptions: {
            placeholder: "Iphone 16, etc..",
            tintColor: BORDER_COLOR,
            textColor: SEARCH_BAR_TEXT_COLOR,
            barTintColor: BAR_TINT_COLOR,

            onChangeText: (e) => {
              const { text } = e.nativeEvent;
              setSearchPhrase(text);
            },
          },
        }}
      />
      <SafeAreaView className="flex-1 w-full">
        <Box className="p-2 h-full flex-1">
          {allProducts.length === 0 ? (
            <View className="h-full w-full items-center justify-center">
              <Text>Products not found</Text>
            </View>
          ) : (
            <FlatList
              key={numColumns}
              data={allProducts}
              numColumns={numColumns}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              contentContainerClassName="gap-2 max-w-[960px] w-full mx-auto"
              contentInsetAdjustmentBehavior="automatic"
              columnWrapperClassName="gap-2"
              renderItem={({ item }) => <ProductListItem product={item} />}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() =>
                isFetchingNextPage ? (
                  <ActivityIndicator className="mt-4" />
                ) : null
              }
            />
          )}
        </Box>
      </SafeAreaView>
    </>
  );
}
