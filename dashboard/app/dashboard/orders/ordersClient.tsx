"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingPage from "@/app/loading";

import { fetchOrders } from "@/features/orders/api/orders";
import { IOrder } from "@/types/types";

const OrdersClient = () => {
  const {
    data: orders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => fetchOrders(),
  });

  if (isPending) {
    return <LoadingPage />;
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: IOrder) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/dashboard/orders/${order.id}`} className="w-full">
                {order.id}
              </Link>
            </TableCell>
            <TableCell>
              {dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}
            </TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersClient;
