import { Pressable } from "react-native";
import { Link } from "expo-router";
import dayjs from "dayjs";

import { IUserOrder } from "@/types/types";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Image } from "./ui/image";
import { Box } from "./ui/box";
import { cn } from "@/utils/utils";
import { STATUS_COLOR } from "@/utils/constants";

interface OrderListItemProps {
  order: IUserOrder;
}

const OrderListItem = ({ order }: OrderListItemProps) => {
  const orderAmount = order.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.price,
    0
  );

  return (
    <Card className="w-full gap-2 border border-blue-200">
      <Link href={`/orders/${order.id}`} asChild>
        <Pressable>
          <VStack className="gap-2">
            <HStack className="justify-between">
              <Text>№ {order.id}</Text>
              <Text className="text-neutral-400">
                {dayjs(order.createdAt).format("DD.MM.YYYY")}
              </Text>
            </HStack>
            <Text className={cn("font-bold", STATUS_COLOR[order.status])}>
              {order.status}
            </Text>
            <HStack className="gap-4">
              {order.items.map((item) => (
                <Box
                  key={item.id}
                  className="w-[84px] h-[84px] flex items-center justify-center border border-gray-300 rounded-md"
                >
                  <Image
                    className="h-full w-full rounded-md  object-fill "
                    source={{ uri: item.product.image }}
                    alt={item.product.name}
                  />
                </Box>
              ))}
            </HStack>
            <HStack className="justify-between">
              <Text>Order amount</Text>
              <Text className="font-bold">${orderAmount}</Text>
            </HStack>
          </VStack>
        </Pressable>
      </Link>
    </Card>
  );
};

export default OrderListItem;
