import { ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import ProductListItem from "../../components/ProductListItem";

import { Text } from "@/components/ui/text";

import { listProducts } from "@/api/products";
import { Box } from "@/components/ui/box";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchBar({ searchPhrase, setSearchPhrase }: any) {
  return (
    // <Box className="p-4 border-b border-blue-300">
    <Input>
      <InputSlot className="pl-3">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        onChangeText={setSearchPhrase}
        placeholder="Search..."
        value={searchPhrase}
        className="border-blue-200 focus:border-blue-500"
      />
    </Input>
    // </Box>
  );
}

export default function HomeScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");

  const searchQuery = `search=${searchPhrase}`;

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

  // if (isLoading) {
  //   return (
  //     <SafeAreaView>
  //       <VStack className="h-screen w-full items-center justify-center">
  //         <ActivityIndicator />
  //       </VStack>
  //     </SafeAreaView>
  //   );
  // }

  if (error) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <SafeAreaView className=" bg-white flex-1">
      {/* <VStack className="max-h-screen"> */}
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
            data={data}
            numColumns={numColumns}
            contentContainerClassName=" gap-2 max-w-[960px] w-full mx-auto bg-neutral-100"
            columnWrapperClassName="gap-2"
            renderItem={({ item }) => <ProductListItem product={item} />}
          />
        )}
      </Box>
      {/* </VStack> */}
    </SafeAreaView>
  );
}
