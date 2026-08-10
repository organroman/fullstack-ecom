import { Request, Response } from "express";

import { orderStatusSchema } from "../../db/schema/orders.js";
import { ALLOWED_ROLES } from "../../utils/constants.js";
import type { RoleType } from "../../types/express/index.js";
import {
  createOrderWithItems,
  getOrderWithItemsById,
  listOrders as listOrdersService,
  updateOrder as updateOrderService,
} from "./orders.service.js";
import { getErrorMessage, getStatusCode } from "../../utils/httpError.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const { order, items } = req.cleanBody;
    const { delivery_address, contact_phone, user_id } = order;

    if (!user_id || !delivery_address || !contact_phone) {
      res.status(400).json({ message: "Invalid order data" });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Order must contain at least one item" });
      return;
    }

    const newOrder = await createOrderWithItems({ order, items });

    if (!newOrder) {
      res
        .status(400)
        .json({ message: "One or more products in the order were not found" });
      return;
    }

    res.status(201).json(newOrder);
  } catch (e) {
    console.error("Error in createOrder controller:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const searchPhrase =
      typeof req.query.search === "string" ? req.query.search : "";
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const page = Math.max(1, Number(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit as string) || 10),
    );

    const parsedStatus = orderStatusSchema.safeParse(req.query.status);

    if (status && !parsedStatus.success) {
      res.status(400).send({ message: "Invalid status" });
      return;
    }

    const orders = await listOrdersService({
      searchPhrase,
      status: parsedStatus.success ? parsedStatus.data : undefined,
      page,
      limit,
      role: req.role as RoleType,
      userId: Number(req.userId),
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in listOrders controller:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid order id" });
      return;
    }

    const order = await getOrderWithItemsById(Number(id));
    if (!order) {
      res.status(404).send({ message: "Order not found" });
      return;
    }

    const isOwner = order.user?.id === Number(req.userId);
    const isElevated = ALLOWED_ROLES.includes(req.role as RoleType);

    if (!isOwner && !isElevated) {
      res.status(403).send({ message: "Access denied" });
      return;
    }

    res.status(200).json(order);
  } catch (e) {
    console.error("Error in getOrderById controller:", e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid order id" });
      return;
    }

    const updatedOrder = await updateOrderService({
      id: Number(id),
      updateOrderInput: req.cleanBody,
      userId: Number(req.userId),
      role: req.role as RoleType,
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrder controller:", error);
    res.status(getStatusCode(error)).send({ message: getErrorMessage(error) });
  }
}
