import { ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";

import { Text } from "@/components/ui/text";

import { listProducts } from "@/api/products";
import { Box } from "@/components/ui/box";

import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import ProductListItem from "@/components/ProductListItem";
import { useLocalSearchParams } from "expo-router";
import { SearchBar } from "@/components/ui/SearchBar";
import { useDebounce } from "@/utils/utils";


export default function HomeScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const { categoryId } = useLocalSearchParams();
  console.log("🚀 ~ categoryId:", categoryId);

  const searchQuery = `search=${searchPhrase}&limit=10&page=1`;

  const debouncedSearchPhrase = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearchPhrase],
    queryFn: () =>
      debouncedSearchPhrase
        ? listProducts(debouncedSearchPhrase)
        : listProducts(),
  });

  console.log("🚀 ~ data:", data);

  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  if (error) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <Box className="p-4 border-b border-blue-300 flex-shrink-0">
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
        />
      </Box>
      <Box className="flex-1 p-2">
        {isLoading ? (
          <VStack className="h-screen w-full items-center justify-center">
            <ActivityIndicator />
          </VStack>
        ) : (
          <FlatList
            key={numColumns}
            data={data.products}
            numColumns={numColumns}
            contentContainerClassName=" gap-2 max-w-[960px] w-full mx-auto bg-neutral-100"
            columnWrapperClassName="gap-2"
            renderItem={({ item }) => <ProductListItem product={item} />}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
