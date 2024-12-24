import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import { SvgUri } from "react-native-svg";

import { useGetCategories } from "@/api/categories/useGetCategories";

import { useTheme } from "@/components/ui/ThemeProvider";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";

import { useDebounce } from "@/utils/utils";
import {
  BAR_TINT_COLOR,
  BG_ACCENT_COLOR,
  BG_COLOR,
  BORDER_COLOR,
  SEARCH_BAR_TEXT_COLOR,
  TEXT_COLOR,
} from "@/utils/constants";

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
    return <Loading />;
  }

  if (error) {
    return <ErrorScreen errorText="Failed to load categories" />;
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Type for search..",
            tintColor: BORDER_COLOR,
            textColor: SEARCH_BAR_TEXT_COLOR,
            barTintColor: BAR_TINT_COLOR,

            onChangeText: (e) => {
              const { text } = e.nativeEvent;
              setSearchPhrase(text);
            },
          },
          headerTransparent: true,

          title: "Categories",
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
            borderColor: BORDER_COLOR,
          },
          headerTintColor: TEXT_COLOR(theme),
          headerStyle: { backgroundColor: BG_ACCENT_COLOR(theme) },
        }}
      />
      <View className="flex-1">
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
                  pathname: `/(tabs)/(products)?categoryId=${item.id}`,
                }}
                className="w-full"
              >
                <View className="w-full flex flex-row items-center border-b border-neutral-300 dark:border-zinc-500 rounded-md p-2 gap-4">
                  <SvgUri uri={item.icon_url} width="24" height="24" />
                  <Text className="no-underline text-zinc-700 dark:text-slate-100 text-md font-semibold w-full">
                    {item.name}
                  </Text>
                </View>
              </Link>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default CategoriesScreen;
