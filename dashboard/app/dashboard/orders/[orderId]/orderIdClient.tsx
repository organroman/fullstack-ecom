"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";

import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingPage from "@/app/loading";
import {
  fetchOrderById,
  updateOrderStatus,
} from "@/features/orders/api/orders";
import { IOrderItem } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = ["New", "Cancelled", "Paid", "Shipped", "Delivered"];

const OrderIdClient = () => {
  const { orderId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("");

  const {
    data: order,
    isPending,
    error,
  } = useQuery({
    queryKey: ["product"],
    queryFn: async () => fetchOrderById(Number(orderId)),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: () => updateOrderStatus(Number(orderId), selectedStatus),
    onSuccess: () => toast.success("Order status updated"),
    onError: (error) => toast.error(error.message),
  });

  if (isPending) {
    return <LoadingPage />;
  }

  const totalAmountOfOrder = order?.items.reduce(
    (acc: number, item: IOrderItem) => acc + item.price * item.quantity,
    0
  );

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateOrderStatusMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row flex-start justify-between">
          <div>
            <CardTitle className="text-lg">Order Details</CardTitle>
            <div className="flex flex-row items-center gap-4 font-bold">
              <CardDescription>Order #{orderId}</CardDescription>
              <CardDescription>
                {dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}
              </CardDescription>

              <Select
                defaultValue={order?.status}
                onValueChange={handleStatusChange}
                disabled={updateOrderStatusMutation.isPending}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <CardTitle className="text-lg">Customer Details</CardTitle>
            <div>
              <CardDescription>{order.user.name}</CardDescription>
              <CardDescription>{order.user.email}</CardDescription>
              <CardDescription>{order.user.address}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="font-semibold">Order items</CardDescription>
        {order.items.map((item: IOrderItem) => (
          <div className="flex flex-row items-center gap-6 py-2" key={item.id}>
            <Image
              src={item.product.image}
              width={40}
              height={40}
              alt={item.product.name}
            />
            <CardDescription>{item.product.name}</CardDescription>
            <CardDescription>{item.quantity}</CardDescription>
            <CardDescription>{item.price}</CardDescription>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <CardDescription>Total: {totalAmountOfOrder}</CardDescription>
        <CardDescription></CardDescription>
      </CardFooter>
    </Card>
  );
};

export default OrderIdClient;
