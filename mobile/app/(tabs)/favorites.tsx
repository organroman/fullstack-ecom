import { View, FlatList } from "react-native";

import CartItem from "@/components/CartProduct";
import Empty from "@/components/Empty";

import { useFavorite } from "@/store/favoriteStore";

export default function FavoritesScreen() {
  const favItems = useFavorite((s) => s.items);

  if (favItems.length === 0) {
    return (
      <Empty
        title="Your wish list is empty"
        desc="But it's always not to late to fill it"
        href="/(products)/products"
        linkText="Go to the shop"
      />
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={favItems}
        contentContainerClassName="gap-2 mx-auto w-full max-w-[960px] p-2 flex-1"
        renderItem={({ item }) => <CartItem item={{ ...item, quantity: 1 }} page="favorites" />}
      />
    </View>
  );
}
