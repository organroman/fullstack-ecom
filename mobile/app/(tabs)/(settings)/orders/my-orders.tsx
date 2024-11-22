import { Text, ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { Box } from "@/components/ui/box";

import OrderListItem from "@/components/OrderListItem";

import { getUserOrders } from "@/api/orders";
import { useAuth } from "@/store/authStore";

const MyOrdersScreen = () => {
  const user = useAuth((s) => s.user);

  if (!user) {
    return <Redirect href="home" />;
  }

  const numColumns = useBreakpointValue({
    default: 1,
    sm: 2,
    xl: 3,
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => await getUserOrders(user.id),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching orders</Text>;
  }

  return (
    <Box className="px-2 py-2 w-full">
      <FlatList
        key={numColumns}
        data={orders}
        contentContainerClassName="gap-4 max-w-[960px] w-full mx-auto mt-2 "
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </Box>
  );
};

export default MyOrdersScreen;
