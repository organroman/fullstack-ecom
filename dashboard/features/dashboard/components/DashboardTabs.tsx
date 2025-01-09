import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardIcon, DollarSignIcon, UsersIcon } from "lucide-react";
import OverviewIndicatorCard from "./OverviewIndicatorCard";
import { Chart } from "./Chart";
import RecentSales from "./RecentSales";
import { DateRange } from "react-day-picker";
import { useGetRevenueByPeriod } from "@/api/dashboard/useGetRevenueByPeriod";
import { useToken } from "@/components/providers/token-provider";
import dayjs from "dayjs";
import { useGetUsersByPeriod } from "@/api/dashboard/useGetUsersByPeriod";
import { useGetTotalSalesByPeriod } from "@/api/dashboard/useGetTotalSalesByPeriod";
import { DashboardTabsProps } from "@/types/types";

const DashboardTabs = ({ date }: DashboardTabsProps) => {
  const token = useToken();
  const start = dayjs(date?.from).format("YYYY-MM-DD");
  const end = dayjs(date?.to).format("YYYY-MM-DD");

  const {
    data: revenue,
    isLoading: revenueIsLoading,
    error: revenueError,
  } = useGetRevenueByPeriod({
    token,
    start,
    end,
  });

  const {
    data: users,
    isLoading: usersIsLoading,
    error: usersError,
  } = useGetUsersByPeriod({
    token,
    start,
    end,
  });

  const {
    data: salesTotal,
    isLoading: salesTotalIsLoading,
    error: salesTotalError,
  } = useGetTotalSalesByPeriod({
    token,
    start,
    end,
  });

  return (
    <Tabs defaultValue="overview" className="h-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Reports
        </TabsTrigger>
        <TabsTrigger value="notifications" disabled>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <OverviewIndicatorCard
            title="Revenue"
            amount={revenue?.currentPeriod || 0}
            prevAmount={revenue?.previousMonth || 0}
            icon={<DollarSignIcon className="text-blue-500" />}
            isLoading={revenueIsLoading}
            error={revenueError}
            indicatorType="money"
          />
          <OverviewIndicatorCard
            title="Users"
            amount={users?.currentPeriod || 0}
            prevAmount={users?.previousMonth || 0}
            icon={<UsersIcon className="text-blue-500" />}
            isLoading={usersIsLoading}
            error={usersError}
            indicatorType="quantity"
          />
          <OverviewIndicatorCard
            title="Sales"
            amount={salesTotal?.currentPeriod || 0}
            prevAmount={salesTotal?.previousMonth || 0}
            icon={<CreditCardIcon className="text-blue-500" />}
            isLoading={salesTotalIsLoading}
            error={salesTotalError}
            indicatorType="quantity"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4 ">
          <Chart />
          <RecentSales date={date} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
