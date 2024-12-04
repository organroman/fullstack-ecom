import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface OverviewIndicatorCardProps {
  title: string;
  amount: string;
  difference: string;
  icon: React.ReactNode;
  differenceColor: string;
}

const OverviewIndicatorCard = ({
  title,
  amount,
  difference,
  icon,
  differenceColor,
}: OverviewIndicatorCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardDescription className="text-lg text-slate-700 dark:text-slate-100 font-bold">
            {title}
          </CardDescription>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-1">{amount}</CardTitle>
        <CardDescription>
          <span className={cn("font-semibold", differenceColor)}>
            {difference}
          </span>{" "}
          from last month
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default OverviewIndicatorCard;
