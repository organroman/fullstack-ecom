import { FlatList } from "react-native";
import { Redirect } from "expo-router";

import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { Box } from "@/components/ui/box";

import OrderListItem from "@/components/OrderListItem";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";

import { useGetOrders } from "@/api/orders/useGetOrders";
import { useAuth } from "@/store/authStore";

const MyOrdersScreen = () => {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => !!s.token);

  if (!user || !token) {
    return <Redirect href="/" />;
  }

  const { data, isLoading, error } = useGetOrders();

  const numColumns = useBreakpointValue({
    default: 1,
    sm: 2,
    xl: 3,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorScreen errorText="Failed to load orders" />;
  }

  return (
    <Box className="p-2 w-full">
      <FlatList
        key={numColumns}
        data={data.orders}
        contentContainerClassName="gap-3 max-w-[960px] w-full mx-auto mt-2 "
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </Box>
  );
};

export default MyOrdersScreen;
