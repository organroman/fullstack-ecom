import CartItem from "@/components/CartItem";
import Empty from "@/components/Empty";
import { VStack } from "@/components/ui/vstack";
import { useFavorite } from "@/store/favoriteStore";
import { View, Text, FlatList } from "react-native";

export default function FavoritesScreen() {
  const favItems = useFavorite((s) => s.items);
  const toggleFavorite = useFavorite((s) => s.toggleProduct);

  if (favItems.length === 0) {
    return (
      <Empty
        title="Your cart is empty"
        desc="But it's always not to late to fill it"
        href="/"
        linkText="Go to the shop"
      />
    );
  }

  return (
    <FlatList
      data={favItems}
      contentContainerClassName="gap-2 mx-auto w-full max-w-[960px] p-2 flex-1"
      renderItem={({ item }) => <CartItem item={{ ...item, quantity: 1 }} />}
    />
  );
}
