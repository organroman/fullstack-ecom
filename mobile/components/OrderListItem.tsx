import { Pressable } from "react-native";
import { Link } from "expo-router";
import dayjs from "dayjs";
import { ChevronRightIcon } from "lucide-react-native";

import { Order } from "@/types/types";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Image } from "./ui/image";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { Icon } from "./ui/icon";

interface OrderListItemProps {
  order: Order;
}

const OrderListItem = ({ order }: OrderListItemProps) => {
  const orderAmount = order.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.price,
    0
  );

  return (
    <Card className="w-full flex-1 border border-neutral-400 dark:border-zinc-800 py-3 px-4">
      <Link href={`/(tabs)/(settings)/(orders)/${order.id}`} asChild>
        <Pressable>
          <HStack space="xl" className="flex-1">
            <Box className="w-[116px] h-[116px] flex items-center justify-center border border-gray-300 rounded-md">
              <Image
                className="h-full w-full rounded-md  object-fill "
                source={{ uri: order.items[0].product.images[0].image_link }}
                alt={order.items[0].product.name}
              />
            </Box>
            <VStack className="flex-1" space="xs">
              <HStack className="items-center justify-between mb-2">
                <Heading size="md" className="text-zinc-700 dark:text-zinc-300">
                  № {order.id}
                </Heading>
                <Icon
                  as={ChevronRightIcon}
                  size="lg"
                  className="text-zinc-700 dark:text-zinc-300 ml-auto"
                />
              </HStack>
              <HStack className="justify-between w-full">
                <Text size="sm" className="text-neutral-500">
                  Status
                </Text>
                <Text
                  size="sm"
                  className="text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  {order.status}
                </Text>
              </HStack>
              <HStack className="justify-between w-full">
                <Text size="sm" className="text-neutral-500">
                  Date
                </Text>
                <Text
                  size="sm"
                  className="text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  {dayjs(order.createdAt).format("DD.MM.YYYY")}
                </Text>
              </HStack>
              <HStack className="justify-between w-full">
                <Text size="sm" className="text-neutral-500">
                  Products
                </Text>
                <Text
                  size="sm"
                  className="text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  {order.items.length +
                    " " +
                    (order.items.length > 1 ? "pcs" : "pc")}
                </Text>
              </HStack>
              <HStack className="justify-between w-full">
                <Text size="sm" className="text-neutral-500">
                  Total amount
                </Text>
                <Text className="text-zinc-700 dark:text-zinc-300 font-bold">
                  $ {orderAmount}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Pressable>
      </Link>
    </Card>
  );
};

export default OrderListItem;
