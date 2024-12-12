import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import { SvgUri } from "react-native-svg";

import { useGetCategories } from "@/api/categories/queries";
import { Box } from "@/components/ui/box";

import { VStack } from "@/components/ui/vstack";
import { SearchBar } from "@/components/ui/SearchBar";
import { useDebounce } from "@/utils/utils";

const CategoriesScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState("");

  const searchQuery = `search=${searchPhrase}`;

  const debouncedSearchPhrase = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useGetCategories(debouncedSearchPhrase);

  const { categories } = data || {};

  // const numColumns = useBreakpointValue({
  //   default: 2,
  //   sm: 3,
  //   xl: 4,
  // });

  return (
    <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1">
      <View className="flex-1 bg-white dark:bg-black">
        <Box className="p-4 border-b-[0.5px] border-blue-500 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
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
              key={1}
              data={categories}
              numColumns={1}
              contentContainerClassName="flex-col gap-4 p-2"
              renderItem={({ item }) => (
                <View className="w-full">
                  <Link
                    href={{
                      pathname: `/(tabs)/(products)?categoryId=${item.slug}`,
                    }}
                    className="w-full"
                  >
                    <View className="w-full flex flex-row items-center border-b border-zinc-500 rounded-md p-2 gap-2">
                      <SvgUri uri={item.icon_url} width="24" height="24" />
                      <Text className="no-underline text-zinc-700 dark:text-slate-100 font-semibold w-full">
                        {item.name}
                      </Text>
                    </View>
                  </Link>
                </View>
              )}
            />
          )}
        </Box>
      </View>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
