"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import DashboardTabs from "@/features/dashboard/components/DashboardTabs";
import dayjs from "dayjs";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Home = () => {
  const currentDate = new Date();
  const startOfMonth = dayjs(currentDate).startOf("month").toDate();

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth,
    to: currentDate,
  });
  
  return (
    <div className="flex flex-col gap-4 flex-1 pt-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-3xl font-bold">Dashboard</h3>
        <div className="flex flex-row items-center gap-2">
          <DateRangePicker date={date} setDate={setDate} />
          <Button>Download</Button>
        </div>
      </div>
      <DashboardTabs date={date} />
    </div>
  );
};

export default Home;
