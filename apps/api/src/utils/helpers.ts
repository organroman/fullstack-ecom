import dayjs from "dayjs";
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export function parseDateRangeQuery(
  query: Record<string, unknown>,
): { start: string; end: string } | null {
  const { start, end } = query;

  if (typeof start !== "string" || typeof end !== "string") {
    return null;
  }

  if (!dayjs(start).isValid() || !dayjs(end).isValid()) {
    return null;
  }

  return { start, end };
}

export const getCurrentDatesAndPreviousMonthDates = (
  start: string,
  end: string
) => {
  const startDate = dayjs(start as string)
    .startOf("day")
    .toDate();

  const endDate = dayjs(end as string)
    .endOf("day")
    .toDate();

  const prevMonthStart = dayjs(start as string)
    .subtract(1, "month")
    .startOf("month")
    .toDate();

  const prevMonthEnd = dayjs(start as string)
    .subtract(1, "month")
    .endOf("month")
    .toDate();

  return { startDate, endDate, prevMonthEnd, prevMonthStart };
};
