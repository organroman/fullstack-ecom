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
import { SlidersHorizontalIcon, View } from "lucide-react-native";
import { Button, ButtonIcon } from "@/components/ui/button";

export default function HomeScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const { categoryId } = useLocalSearchParams();


  const searchQuery = categoryId
    ? `search=${searchPhrase}&limit=10&page=1&categoryId=${categoryId}`
    : `search=${searchPhrase}&limit=10&page=1`;

  const debouncedSearchPhrase = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearchPhrase],
    queryFn: () =>
      debouncedSearchPhrase
        ? listProducts(debouncedSearchPhrase)
        : listProducts(),
  });


  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  if (error) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1 w-full">
      {/* <View className=" bg-white dark:bg-black w-full h-full"> */}
      <Box className="w-full flex flex-row items-center gap-2 p-4 border-b-[0.5px] border-blue-500 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
        />

        <Button
          variant="link"
          className="min-w-10"
        >
          <ButtonIcon as={SlidersHorizontalIcon} />
        </Button>
      </Box>
      <Box className="p-2 bg-white dark:bg-black h-full flex-1">
        {isLoading ? (
          <VStack className="h-screen w-full items-center justify-center">
            <ActivityIndicator />
          </VStack>
        ) : (
          <FlatList
            key={numColumns}
            data={data.products}
            numColumns={numColumns}
            contentContainerClassName=" gap-2 max-w-[960px] w-full mx-auto"
            columnWrapperClassName="gap-2"
            renderItem={({ item }) => <ProductListItem product={item} />}
          />
        )}
      </Box>
      {/* </View> */}
    </SafeAreaView>
  );
}
