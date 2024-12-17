import { useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import { SvgUri } from "react-native-svg";

import { useGetCategories } from "@/api/categories/queries";

import { VStack } from "@/components/ui/vstack";
import { SearchBar } from "@/components/ui/SearchBar";
import { useDebounce } from "@/utils/utils";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  barTintColor,
  bgColor,
  borderColor,
  headerColorText,
} from "@/utils/constants";
import { Button, ButtonIcon } from "@/components/ui/button";
import { SearchIcon } from "lucide-react-native";

const CategoriesScreen = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const { theme } = useTheme();

  const searchQuery = `search=${searchPhrase}`;

  const debouncedSearchPhrase = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useGetCategories(debouncedSearchPhrase);

  const { categories } = data || {};

  // const numColumns = useBreakpointValue({
  //   default: 2,
  //   sm: 3,
  //   xl: 4,
  // });

  if (isLoading) {
    return (
      <VStack className="w-full h-screen items-center justify-center">
        <ActivityIndicator />
      </VStack>
    );
  }

  return (
    <View className="bg-zinc-100 dark:bg-zinc-900 flex-1">
      <Stack.Screen
        options={{
          // headerSearchBarOptions: {
          //   placeholder: "Type for search..",
          //   tintColor: headerColorText(theme),
          //   textColor: headerColorText(theme),
          //   barTintColor: barTintColor(theme),
          //   headerIconColor: "#ffffff",
          //   hintTextColor: headerColorText(theme),

          //   onChangeText: (e) => {
          //     const { text } = e.nativeEvent;
          //     setSearchPhrase(text);
          //   },
          // },
          headerTransparent: true,
          headerRight: () => (
            <Button variant="link">
              <ButtonIcon as={SearchIcon} />
            </Button>
          ),

          title: "Categories",
          contentStyle: {
            backgroundColor: bgColor(theme),
            borderColor: borderColor,
          },
          headerTintColor: headerColorText(theme),
          headerStyle: { backgroundColor: bgColor(theme) },

          // headerShown: false,
        }}
      />
      <View className="flex-1 bg-white dark:bg-black">
        {/* <Box className="p-4 border-b-[0.5px] border-blue-500 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
          />
        </Box> */}
        {/* <Box className=" p-2">
          {isLoading ? (
            <VStack className="w-full items-center justify-center">
              <ActivityIndicator />
            </VStack>
          ) : ( */}
        <FlatList
          key={1}
          data={categories}
          numColumns={1}
          contentContainerClassName="flex-col gap-4 p-2"
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => (
            <View className="w-full">
              <Link
                href={{
                  pathname: `/(tabs)/(products)/index/?categoryId=${item.id}`,
                }}
                className="w-full"
              >
                <View className="w-full flex flex-row items-center border-b border-zinc-500 rounded-md p-2 gap-4">
                  <SvgUri uri={item.icon_url} width="24" height="24" />
                  <Text className="no-underline text-zinc-700 dark:text-slate-100 text-md font-semibold w-full">
                    {item.name}
                  </Text>
                </View>
              </Link>
            </View>
          )}
        />
        {/* )} */}
        {/* </Box> */}
      </View>
    </View>
  );
};

export default CategoriesScreen;
