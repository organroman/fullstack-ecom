
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardIcon, DollarSignIcon, UsersIcon } from "lucide-react";
import OverviewIndicatorCard from "./OverviewIndicatorCard";
import { Chart } from "./Chart";
import RecentSales from "./RecentSales";

const DashboardTabs = () => {
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
            title="Total Revenue"
            amount="$45,231.89"
            difference="+20.1%"
            icon={<DollarSignIcon className="text-blue-500" />}
            differenceColor="text-green-500"
          />
          <OverviewIndicatorCard
            title="Users"
            amount="+2350"
            difference="+180.1%"
            icon={<UsersIcon className="text-blue-500" />}
            differenceColor="text-green-500"
          />
          <OverviewIndicatorCard
            title="Sales"
            amount="+12,234"
            difference="+19%"
            icon={<CreditCardIcon className="text-blue-500" />}
            differenceColor="text-green-500"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4 ">
          <Chart />
          <RecentSales />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
