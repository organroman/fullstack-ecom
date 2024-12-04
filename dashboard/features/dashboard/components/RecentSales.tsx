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

const RecentSales = () => {
  //TODO: calculate sales manager sales calculate sales manager sales
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-10">
        <RecentSalesCard
          name="Olivia Martin"
          avatarUrl="/img/avatar-girl.png"
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
        />
      </CardContent>
    </Card>
  );
};

export default RecentSales;
