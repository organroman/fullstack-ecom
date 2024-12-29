"use client";
import { EOrderStatus, OrderItem } from "@/types/types";
import { useParams } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";

import LoadingPage from "@/app/loading";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import OrderFormModal from "@/features/orders/components/OrderFormModal";

import { useDialog } from "@/hooks/use-modal";
import { useUpdateOrderStatus } from "@/api/orders/useChangeOrderStatus";
import { useGetOrderById } from "@/api/orders/useGetOrderById";
import { useToken } from "@/components/providers/token-provider";
import ErrorPage from "@/app/error";
import { ORDER_STATUSES } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EclipseIcon,
  EllipsisIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import OrderDetail from "@/features/orders/components/OrderDetail";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const OrderIdClient = () => {
  const { orderId } = useParams();
  const { dialogOpen, setDialogOpen } = useDialog();
  const queryClient = useQueryClient();
  const token = useToken();
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderById({ id: Number(orderId), token });

  const { updateStatus } = useUpdateOrderStatus({
    orderId: Number(orderId),
    token,
    queryClient,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  const totalAmountOfOrder = order?.items.reduce(
    (acc: number, item: OrderItem) => acc + item.price * item.quantity,
    0
  );

  const totalItemsQuantity = order?.items.reduce(
    (acc: number, item: OrderItem) => acc + item.quantity,
    0
  );

  const handleStatusChange = (status: EOrderStatus) => {
    updateStatus.mutate(status);
  };

  const enableEditingAddress = () => {
    setIsEditingAddress(true);
  };

  const disableEditingAddress = () => {
    setIsEditingAddress(false);
  };

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Order details"
        dialogButtonLabel="Create order"
        dialogContent={<OrderFormModal />}
        dialogOpen={dialogOpen}
        dialogHandleOpen={setDialogOpen}
        backBtn
      />
      <Card className="flex-grow">
        <CardHeader className="grid grid-cols-3 gap-4">
          <CardTitle className="col-span-1">Order #{orderId}</CardTitle>
          <CardTitle className="col-span-2">Order items</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 flex-grow">
          <div className="col-span-1 items-start flex flex-col gap-2 font-semibold border-r border-zinc-700">
            <OrderDetail
              title="Date:"
              value={dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
            />
            <OrderDetail
              title="Status:"
              value={
                <div className="col-span-4">
                  <Select
                    defaultValue={order?.status}
                    onValueChange={handleStatusChange}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {capitalizeFirstLetter(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
            />

            <h3 className="text-xl mt-4">Customer</h3>
            <OrderDetail title="Name:" value={order?.user.name} />
            <OrderDetail title="Phone:" value={order?.contact_phone} />
            <OrderDetail title="Email:" value={order?.user.email} />
            {isEditingAddress ? (
              <div className="w-full flex items-center justify-between gap-4">
                editing mode
                {/* TODO: INPUT  */}
                <div className="flex flex-row items-center gap-1">
                  <Button
                    onClick={disableEditingAddress}
                    variant="link"
                    className="p-0 text-red-500 [&_svg]:size-6"
                    size="icon"
                  >
                    <XIcon className="w-8 h-8" size={40} />
                  </Button>
                  <Button
                    onClick={enableEditingAddress}
                    variant="link"
                    className="p-0 [&_svg]:size-6"
                    size="icon"
                  >
                    <SaveIcon />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full relative">
                <OrderDetail title="Address:" value={order?.delivery_address} />
                <Button
                  onClick={enableEditingAddress}
                  variant="link"
                  className="absolute -top-1 right-2 p-0"
                  size="icon"
                >
                  <PencilIcon />
                </Button>
              </div>
            )}
          </div>

          <div className="w-full col-span-2">
            <div className="grid grid-cols-8 mb-4 font-semibold">
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                Image
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-3">
                Name
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                Quantity
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                Price
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                Total
              </p>
              <EllipsisIcon className="size-6 col-span-1 justify-self-end  text-zinc-700 dark:text-zinc-300" />
            </div>
            {order?.items.map((item: OrderItem) => (
              <div
                className="grid grid-cols-8 font-semibold items-center overflow-y-auto"
                key={item.id}
              >
                <Image
                  src={item.product.images[0].image_link}
                  width={40}
                  height={40}
                  alt={item.product.name}
                  className="w-20 aspect-square col-span-1 mb-2"
                />
                <p className="text-md text-neutral-400 col-span-3">
                  {item.product.name}
                </p>
                <p className="text-md text-neutral-400 col-span-1">
                  {item.quantity}
                </p>
                <p className="text-md text-neutral-400 col-span-1">
                  ${item.price.toLocaleString()}
                </p>
                <p className="text-md text-neutral-400 col-span-1">
                  ${(item.quantity * item.price).toLocaleString()}
                </p>

                <Button
                  variant="destructive"
                  size="icon"
                  className="col-span-1 justify-self-end"
                >
                  <MinusIcon />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-8 font-bold mt-6 items-center">
              <p className="text-xl text-zinc-700 dark:text-zinc-300 col-span-4">
                Totals
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                {totalItemsQuantity}
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
                -
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1 font-bold">
                ${totalAmountOfOrder?.toLocaleString()}
              </p>
              <Button size="icon" className="col-span-1 justify-self-end">
                <PlusIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderIdClient;
