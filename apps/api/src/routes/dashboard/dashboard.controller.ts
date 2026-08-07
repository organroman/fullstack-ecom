import { Request, Response } from "express";
import {
  getTotalRevenueByPeriod as getTotalRevenueByPeriodService,
  getTotalUsersByPeriod as getTotalUsersByPeriodService,
  getTotalSalesByPeriod as getTotalSalesByPeriodService,
  getRecentSalesByPeriod as getRecentSalesByPeriodService,
} from "./dashboard.service.js";
import { parseDateRangeQuery } from "../../utils/helpers.js";

export async function getTotalRevenueByPeriod(req: Request, res: Response) {
  try {
    const dateRange = parseDateRangeQuery(req.query);

    if (!dateRange) {
      res.status(400).send({ message: "Start or end of period is invalid" });
      return;
    }

    const revenueData = await getTotalRevenueByPeriodService(
      dateRange.start,
      dateRange.end,
    );

    res.status(200).json(revenueData);
  } catch (e) {
    console.error(`Error in getTotalRevenueByPeriod:`, e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getTotalUsersByPeriod(req: Request, res: Response) {
  try {
    const dateRange = parseDateRangeQuery(req.query);

    if (!dateRange) {
      res.status(400).send({ message: "Start or end of period is invalid" });
      return;
    }

    const result = await getTotalUsersByPeriodService(
      dateRange.start,
      dateRange.end,
    );

    res.status(200).json(result);
  } catch (e) {
    console.error(`Error in getTotalUsersByPeriod:`, e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getTotalSalesByPeriod(req: Request, res: Response) {
  try {
    const dateRange = parseDateRangeQuery(req.query);

    if (!dateRange) {
      res.status(400).send({ message: "Start or end of period is invalid" });
      return;
    }

    const result = await getTotalSalesByPeriodService(
      dateRange.start,
      dateRange.end,
    );

    res.status(200).json(result);
  } catch (e) {
    console.error(`Error in getTotalSalesByPeriod:`, e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getRecentSalesByPeriod(req: Request, res: Response) {
  try {
    const dateRange = parseDateRangeQuery(req.query);

    if (!dateRange) {
      res.status(400).send({ message: "Start or end of period is invalid" });
      return;
    }
    const result = await getRecentSalesByPeriodService(
      dateRange.start,
      dateRange.end,
    );
    res.status(200).json(result);
  } catch (e) {
    console.error(`Error in getRecentSalesByPeriod:`, e);
    res.status(500).send({ message: "Something went wrong" });
  }
}
