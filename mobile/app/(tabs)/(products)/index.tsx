import React from "react";
import { ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import { useState } from "react";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { LogsIcon } from "lucide-react-native";

import { useInfiniteProducts } from "@/api/products/useInfiniteProducts";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";

import ProductListItem from "@/components/ProductListItem";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import { useTheme } from "@/components/ui/ThemeProvider";
import Empty from "@/components/Empty";

import { useDebounce } from "@/utils/utils";
import {
  BAR_TINT_COLOR,
  BORDER_COLOR,
  SEARCH_BAR_TEXT_COLOR,
  TEXT_COLOR,
} from "@/utils/constants";

export default function ProductsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const { categoryId } = useGlobalSearchParams<{ categoryId: string }>();

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
    categoryId: categoryId ? categoryId : undefined,
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

  if (allProducts.length === 0) {
    return <Empty title="Products not found" desc="Try another keywords" />;
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
          headerLeft: () => undefined,
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
              isFetchingNextPage ? <ActivityIndicator className="mt-4" /> : null
            }
          />
        </Box>
      </SafeAreaView>
    </>
  );
}
