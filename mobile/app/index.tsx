import { FlatList } from "react-native";

import ProductListItem from "../components/ProductListItem";

import products from "../assets/products.json";

export default function HomeScreen() {
  return (
    <FlatList
      data={products}
      numColumns={2}
      contentContainerClassName="gap-2"
      columnWrapperClassName="gap-2"
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  );
}
