import { DateRangePicker } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import DashboardTabs from "@/features/dashboard/components/DashboardTabs";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 flex-1 pt-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-3xl font-bold">Dashboard</h3>
        <div className="flex flex-row items-center gap-2">
          <DateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <DashboardTabs />
    </div>
  );
};

export default Home;
