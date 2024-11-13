import { ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import ProductListItem from "../components/ProductListItem";

import { listProducts } from "./api/products";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });

  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <FlatList
      key={numColumns}
      data={data}
      numColumns={numColumns}
      contentContainerClassName="gap-2 max-w-[960px] w-full mx-auto"
      columnWrapperClassName="gap-2"
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  );
}
