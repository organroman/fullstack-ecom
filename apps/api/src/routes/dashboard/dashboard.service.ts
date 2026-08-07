import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/schema/orders.js";
import { and, between, ne, sql, eq, count, desc } from "drizzle-orm";
import { getCurrentDatesAndPreviousMonthDates } from "../../utils/helpers";
import type {
  DashboardItemPeriodResponse,
  DashboardRecentSalesResponse,
} from "./dashboard.types";
import { usersTable } from "../../db/schema/users.js";

export async function getTotalRevenueByPeriod(
  start: string,
  end: string,
): Promise<DashboardItemPeriodResponse> {
  const { startDate, endDate, prevMonthStart, prevMonthEnd } =
    getCurrentDatesAndPreviousMonthDates(start, end);

  const [totalRevenueCurrentPeriod, totalRevenuePrevMonthPeriod] =
    await Promise.all([
      db
        .select({
          totalRevenue: sql<number>`SUM(order_items.price * order_items.quantity)`,
        })
        .from(ordersTable)
        .innerJoin(
          orderItemsTable,
          eq(ordersTable.id, orderItemsTable.order_id),
        )
        .where(
          and(
            ne(ordersTable.status, "CANCELLED"),
            between(ordersTable.created_at, startDate, endDate),
          ),
        ),
      db
        .select({
          totalRevenue: sql<number>`SUM(order_items.price * order_items.quantity)`,
        })
        .from(ordersTable)
        .innerJoin(
          orderItemsTable,
          eq(ordersTable.id, orderItemsTable.order_id),
        )
        .where(
          and(
            ne(ordersTable.status, "CANCELLED"),
            between(ordersTable.created_at, prevMonthStart, prevMonthEnd),
          ),
        ),
    ]);

  return {
    currentPeriod: totalRevenueCurrentPeriod[0]?.totalRevenue || 0,
    previousMonth: totalRevenuePrevMonthPeriod[0]?.totalRevenue || 0,
  };
}

export async function getTotalUsersByPeriod(
  start: string,
  end: string,
): Promise<DashboardItemPeriodResponse> {
  const { startDate, endDate, prevMonthStart, prevMonthEnd } =
    getCurrentDatesAndPreviousMonthDates(start, end);

  const [currentPeriodUsers, previousMonthUsers] = await Promise.all([
    db
      .select({ totalUsers: count() })
      .from(usersTable)
      .where(between(usersTable.created_at, startDate, endDate)),
    db
      .select({ totalUsers: count() })
      .from(usersTable)
      .where(between(usersTable.created_at, prevMonthStart, prevMonthEnd)),
  ]);

  return {
    currentPeriod: currentPeriodUsers[0]?.totalUsers || 0,
    previousMonth: previousMonthUsers[0]?.totalUsers || 0,
  };
}

export async function getTotalSalesByPeriod(
  start: string,
  end: string,
): Promise<DashboardItemPeriodResponse> {
  const { startDate, endDate, prevMonthStart, prevMonthEnd } =
    getCurrentDatesAndPreviousMonthDates(start, end);

  const [currentPeriodSales, prevMonthSales] = await Promise.all([
    db
      .select({ totalSales: count() })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate),
        ),
      ),
    db
      .select({ totalSales: count() })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, prevMonthStart, prevMonthEnd),
        ),
      ),
  ]);

  return {
    currentPeriod: currentPeriodSales[0]?.totalSales || 0,
    previousMonth: prevMonthSales[0]?.totalSales || 0,
  };
}

export async function getRecentSalesByPeriod(
  start: string,
  end: string,
): Promise<DashboardRecentSalesResponse> {
  const { startDate, endDate, prevMonthStart, prevMonthEnd } =
    getCurrentDatesAndPreviousMonthDates(start, end);

  const [totalOrders, recentSales] = await Promise.all([
    db
      .select({
        totalOrders: count(),
      })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate),
        ),
      ),
    db
      .select({
        orderId: ordersTable.id,
        userName: usersTable.name,
        userEmail: usersTable.email,
        orderAmount: sql<number>`SUM(order_items.price * order_items.quantity)`,
      })
      .from(ordersTable)
      .innerJoin(usersTable, eq(usersTable.id, ordersTable.user_id))
      .innerJoin(orderItemsTable, eq(orderItemsTable.order_id, ordersTable.id))
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate),
        ),
      )
      .groupBy(ordersTable.id, usersTable.name, usersTable.email)
      .orderBy(desc(ordersTable.created_at))
      .limit(5),
  ]);

  return {
    totalOrders: totalOrders[0]?.totalOrders || 0,
    recentSales: recentSales,
  };
}
