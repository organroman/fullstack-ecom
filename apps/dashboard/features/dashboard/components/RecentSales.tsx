"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import RecentSalesCard from "./RecentSalesCard";
import { DashboardTabsProps } from "@/types/types";
import { useGetRecentSalesByPeriod } from "@/api/dashboard/useGetRecentSalesByPeriod ";
import { useToken } from "@/components/providers/token-provider";
import dayjs from "dayjs";
import { Loader } from "lucide-react";

const AVATAR_URLS = [
  "/img/avatar-girl-1.png",
  "/img/avatar-man-1.png",
  "/img/avatar-girl-2.png",
  "/img/avatar-man-2.png",
  "/img/avatar-girl-3.png",
];

const RecentSales = ({ date }: DashboardTabsProps) => {
  const token = useToken();
  const start = dayjs(date?.from).format("YYYY-MM-DD");
  const end = dayjs(date?.to).format("YYYY-MM-DD");

  const { data, isLoading, error } = useGetRecentSalesByPeriod({
    token,
    start,
    end,
  });

  const { recentSales = [], totalOrders } = data || {};

  console.log("data", data);
  console.log("isLoading", isLoading);
  console.log("error", error);

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Loader className="size-6 text-blue-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col  items-center justify-center">
          <p className="text-xl font-semibold">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  //TODO: calculate sales manager sales calculate sales manager sales
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>{`You made ${totalOrders} sales this period`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-10">
        {recentSales.map((sale, index) => (
          <RecentSalesCard
            key={sale.orderId}
            name={sale.userName}
            avatarUrl={AVATAR_URLS[index]}
            email={sale.userEmail}
            amount={sale.orderAmount}
          />
        ))}
        {/* <RecentSalesCard
          name="Olivia Martin"
          avatarUrl="/img/avatar-girl-1.png"
          email="olivia.martin@mail.com"
          amount="1,999.00"
        />
        <RecentSalesCard
          name="Jackson Lee"
          avatarUrl="/img/avatar-man-1.png"
          email="ackson.lee@email.com"
          amount="39.00"
        />
        <RecentSalesCard
          name="Isabella Nguyen"
          avatarUrl="/img/avatar-girl-2.png"
          email="will@email.com"
          amount="99.00"
        />
        <RecentSalesCard
          name="William Kim"
          avatarUrl="/img/avatar-man-2.png"
          email="will@email.com"
          amount="99.00"
        />
        <RecentSalesCard
          name="Sofia Davis"
          avatarUrl="/img/avatar-girl-3.png"
          email="sofia.davis@email.com"
          amount="499.00"
        /> */}
      </CardContent>
    </Card>
  );
};

export default RecentSales;
