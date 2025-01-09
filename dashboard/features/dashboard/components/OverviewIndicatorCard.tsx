import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";

interface OverviewIndicatorCardProps {
  title: string;
  amount: number;
  prevAmount: number;
  icon: React.ReactNode;
  isLoading: boolean;
  error: Error | null;
  indicatorType: "money" | "quantity";
}

const OverviewIndicatorCard = ({
  title,
  amount,
  prevAmount,
  icon,
  isLoading,
  error,
  indicatorType,
}: OverviewIndicatorCardProps) => {
  console.log("🚀 ~ prevAmount:", prevAmount);
  console.log("🚀 ~ amount:", amount);
  const difference = (amount * 100) / prevAmount - 100;
  console.log("🚀 ~ difference:", difference);

  if (isLoading) {
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
          <Loader className="size-6 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }
  if (error) {
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
          <CardTitle className="text-red-500">{error.message}</CardTitle>
        </CardContent>
      </Card>
    );
  }

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
        <CardTitle className="mb-1">
          {indicatorType === "money"
            ? `$ ${amount.toLocaleString()}`
            : `+ ${amount.toLocaleString()}`}
        </CardTitle>
        <CardDescription>
          {prevAmount > 0 ? (
            <>
              <span
                className={cn(
                  "font-bold",
                  difference > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {`${difference.toFixed(2)}%`}
              </span>{" "}
              <span>to last month</span>
            </>
          ) : (
            <span className="font-semibold">NA %</span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default OverviewIndicatorCard;
