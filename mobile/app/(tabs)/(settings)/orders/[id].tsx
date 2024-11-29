import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { getUserOrder } from "@/api/orders";
import { useAuth } from "@/store/authStore";
import { VStack } from "@/components/ui/vstack";
import { cn } from "@/utils/utils";

import { STATUS_COLOR } from "@/utils/constants";
import { IUserOrder } from "@/types/types";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";

const OrderIdScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => !!s.token);

  if (!token || !user) {
    return <Redirect href="/(products)" />;
  }

  const {
    data: order,
    isLoading,
    error,
  } = useQuery<IUserOrder>({
    queryKey: ["order"],
    queryFn: () => getUserOrder(user.id, Number(id)),
  });

  if (!order) {
    return <Redirect href="/(products)" />;
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching order</Text>;
  }
  console.log(order);

  return (
    <SafeAreaView>
      <HStack className="fixed top-0 left-0 py-2 px-4 items-center border-b border-blue-600">
        <Button variant="link" onPress={() => router.back()}>
          <ButtonIcon as={ChevronLeft} className="w-6 h-6" />
        </Button>
        <Text className="mx-auto text-xl text-primary-900">
          Order №{order.id}
        </Text>
      </HStack>
      <VStack className="px-4 py-2 border-b border-blue-200">
        <Text className="text-sm text-primary-100">Order Status</Text>
        <Text className={cn("font-bold", STATUS_COLOR[order.status])}>
          {order.status}
        </Text>
      </VStack>
      <VStack>
        {order.items.map((p) => {
          return (
            <Card
              key={p.id}
              className="border-b border-blue-200 flex flex-col gap-4"
            >
              <Link href={`/product/${p.product.id}`}>
                <HStack className="gap-4">
                  <Image
                    source={{ uri: p.product.image }}
                    className="w-[80px] h-80px rounded-md"
                  />
                  <Text>{p.product.name}</Text>
                </HStack>
              </Link>
              <HStack className="justify-between items-center">
                <Text className="font-semibold">{p.quantity} pcs</Text>
                <Text className="font-bold">$ {p.price}</Text>
              </HStack>
              <Text className="text-bold text-lg text-blue-700 text-center">
                Leave a feedback
              </Text>
            </Card>
          );
        })}
      </VStack>
    </SafeAreaView>
  );
};

export default OrderIdScreen;
