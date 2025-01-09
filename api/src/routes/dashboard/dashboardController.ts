import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/schema/orders.js";
import { and, between, ne, sql, eq, count, desc, inArray } from "drizzle-orm";
import { getCurrentDatesAndPreviousMonthDates } from "../../utils/helpers.js";
import { usersTable } from "../../db/schema/users.js";
import { Item, Order } from "../orders/ordersController.js";

export async function getTotalRevenueByPeriod(req: Request, res: Response) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).send({ message: "Start or end of period is absent" });
      return;
    }

    const { startDate, endDate, prevMonthStart, prevMonthEnd } =
      getCurrentDatesAndPreviousMonthDates(start as string, end as string);

    const totalRevenueCurrentPeriod = await db
      .select({
        totalRevenue: sql<number>`SUM(order_items.price * order_items.quantity)`,
      })
      .from(ordersTable)
      .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate)
        )
      );

    const totalRevenuePrevMonthPeriod = await db
      .select({
        totalRevenue: sql<number>`SUM(order_items.price * order_items.quantity)`,
      })
      .from(ordersTable)
      .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, prevMonthStart, prevMonthEnd)
        )
      );

    res.status(200).json({
      currentPeriod: totalRevenueCurrentPeriod[0]?.totalRevenue || 0,
      previousMonth: totalRevenuePrevMonthPeriod[0]?.totalRevenue || 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export async function getTotalUsersByPeriod(req: Request, res: Response) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).send({ message: "Start or end of period is absent" });
      return;
    }

    const { startDate, endDate, prevMonthStart, prevMonthEnd } =
      getCurrentDatesAndPreviousMonthDates(start as string, end as string);

    const currentPeriodUsers = await db
      .select({ totalUsers: count() })
      .from(usersTable)
      .where(between(usersTable.created_at, startDate, endDate));

    const prevMonthUsers = await db
      .select({ totalUsers: count() })
      .from(usersTable)
      .where(between(usersTable.created_at, prevMonthStart, prevMonthEnd));

    res.status(200).json({
      currentPeriod: currentPeriodUsers[0]?.totalUsers || 0,
      previousMonth: prevMonthUsers[0]?.totalUsers || 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export async function getTotalSalesByPeriod(req: Request, res: Response) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).send({ message: "Start or end of period is absent" });
      return;
    }

    const { startDate, endDate, prevMonthStart, prevMonthEnd } =
      getCurrentDatesAndPreviousMonthDates(start as string, end as string);

    const currentPeriodSales = await db
      .select({ totalSales: count() })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate)
        )
      );

    const prevMonthSales = await db
      .select({ totalSales: count() })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, prevMonthStart, prevMonthEnd)
        )
      );

    res.status(200).json({
      currentPeriod: currentPeriodSales[0]?.totalSales || 0,
      previousMonth: prevMonthSales[0]?.totalSales || 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export async function getRecentSalesByPeriod(req: Request, res: Response) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).send({ message: "Start or end of period is absent" });
      return;
    }

    const { startDate, endDate } = getCurrentDatesAndPreviousMonthDates(
      start as string,
      end as string
    );

    const [{ totalOrders }] = await db
      .select({
        totalOrders: count(),
      })
      .from(ordersTable)
      .where(
        and(
          ne(ordersTable.status, "CANCELLED"),
          between(ordersTable.created_at, startDate, endDate)
        )
      );

    const recentSales = await db
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
          between(ordersTable.created_at, startDate, endDate)
        )
      )
      .groupBy(ordersTable.id, usersTable.name, usersTable.email)
      .orderBy(desc(ordersTable.created_at))
      .limit(5);

    res.status(200).json({
      totalOrders,
      recentSales,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}
