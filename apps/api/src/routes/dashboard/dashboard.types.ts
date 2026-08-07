export type DashboardItemPeriodResponse = {
  currentPeriod: number;
  previousMonth: number;
};

export type DashboardRecentSalesResponse = {
  totalOrders: number;
  recentSales: {
    orderId: number;
    userName: string | null;
    userEmail: string;
    orderAmount: number;
  }[];
};
