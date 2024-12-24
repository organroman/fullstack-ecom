import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import React from "react";
import dayjs from "dayjs";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";

import { useTheme } from "@/components/ui/ThemeProvider";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";

import { useAuth } from "@/store/authStore";

import { useGetOrderById } from "@/api/orders/useGetOrderById";

import { BG_COLOR, TEXT_COLOR } from "@/utils/constants";

const OrderIdScreen = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => !!s.token);

  if (!token || !user) {
    return <Redirect href="/(products)" />;
  }

  const { data: order, isLoading, error } = useGetOrderById(id);

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return <Redirect href="/" />;
  }

  if (error) {
    return <ErrorScreen errorText="Failed to load order" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: BG_COLOR(theme),
          },
          headerTitleStyle: {
            color: TEXT_COLOR(theme),
          },
        }}
      />
      <ScrollView className="p-2">
        <VStack
          space="lg"
          className="bg-neutral-200 dark:bg-zinc-800 rounded-md p-2"
        >
          <VStack
            space="xs"
            className="border-b border-neutral-400 dark:border-zinc-600 pb-2"
          >
            <Heading size="sm" className="mb-2">
              Order number: {order.id}
            </Heading>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              Order date: {dayjs(order.createdAt).format("DD.MM.YYYY")}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              Products: {order.items.length}
            </Text>
          </VStack>
          <VStack
            space="xs"
            className="border-b border-neutral-400 dark:border-zinc-600 pb-2"
          >
            <Heading size="sm" className="mb-1">
              Order status:
            </Heading>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              {order.status}
            </Text>
          </VStack>
          <VStack
            space="xs"
            className="border-b border-neutral-400 dark:border-zinc-600 pb-2"
          >
            <Heading size="sm" className="mb-1">
              Customer details:
            </Heading>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              {order.user.name}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              {order.user.email}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              {order.contact_phone}
            </Text>
            <Heading size="sm" className="mb-1 mt-4">
              Delivery address:
            </Heading>
            <Text className="text-neutral-500 dark:text-neutral-400 text-md">
              {order.delivery_address}
            </Text>
          </VStack>
          <VStack>
            <Heading size="sm" className="mt-2 mb-4">
              Ordered items
            </Heading>
            {order.items.map((item) => (
              <Card
                key={item.id}
                className="w-full flex-1 border-b border-neutral-400 dark:border-zinc-600 p-0 pb-4 bg-transparent mt-2"
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(settings)/(orders)/product-details",
                      params: { id: item.product.id },
                    })
                  }
                >
                  <HStack space="xl" className="flex-1">
                    <Box className="w-[84px] h-[84px] flex items-center justify-center border border-gray-300 rounded-md">
                      <Image
                        className="h-full w-full rounded-md  object-fill "
                        source={{
                          uri: item.product.images[0].image_link,
                        }}
                        alt={item.product.name}
                      />
                    </Box>
                    <VStack className="flex-1">
                      <HStack className="items-start justify-between">
                        <Heading
                          size="sm"
                          className="text-zinc-700 dark:text-zinc-300 max-w-[200px]"
                        >
                          {item.product.name}
                        </Heading>
                        <Icon
                          as={ChevronRightIcon}
                          size="lg"
                          className="text-zinc-700 dark:text-zinc-300 ml-auto"
                        />
                      </HStack>
                      <Heading
                        size="sm"
                        className="text-zinc-700 dark:text-zinc-300"
                      >
                        $ {item.price}
                      </Heading>
                    </VStack>
                  </HStack>
                </Pressable>
              </Card>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </>
  );
};

export default OrderIdScreen;
