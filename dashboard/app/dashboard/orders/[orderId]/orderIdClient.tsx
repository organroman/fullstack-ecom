"use client";
import { EOrderStatus, OrderItem } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

import LoadingPage from "@/app/loading";
import ErrorPage from "@/app/error";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Header from "@/components/Header";
import { useToken } from "@/components/providers/token-provider";

import OrderDetail from "@/features/orders/components/OrderDetail";
import StatusChangeSelector from "@/features/orders/components/StatusChangeSelector";
import EditAddress from "@/features/orders/components/EditAddress";

import { useUpdateOrder } from "@/api/orders/useUpdateOrder";
import { useGetOrderById } from "@/api/orders/useGetOrderById";
import OrderItemsList from "@/features/orders/components/OrderItemsList";

const OrderIdClient = () => {
  const token = useToken();
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderById({ id: Number(orderId), token });

  const { updateOrderMutation } = useUpdateOrder({
    token,
    queryClient,
    order: order || {},
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!order) {
    return <ErrorPage error={"No order found"} />;
  }

  const handleStatusChange = (status: EOrderStatus) => {
    updateOrderMutation.mutate({ status });
  };

  if (error) {
    return <ErrorPage error={error?.message || "Failed to get order"} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Order details"
        createItemVariant={{
          variant: "page",
          link: "/dashboard/orders/new",
          btnLabel: "Create Order",
        }}
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
                  <StatusChangeSelector
                    order={order}
                    disabled={updateOrderMutation.isPending}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              }
            />

            <h3 className="text-xl mt-4">Customer</h3>
            <OrderDetail title="Name:" value={order?.user.name} />
            <OrderDetail title="Phone:" value={order?.contact_phone} />
            <OrderDetail title="Email:" value={order?.user.email} />
            <EditAddress
              order={order}
              updateOrderMutation={updateOrderMutation}
            />
          </div>
          <OrderItemsList order={order} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderIdClient;
