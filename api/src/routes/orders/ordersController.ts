import { Request, Response } from "express";

import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js";
import { eq } from "drizzle-orm";
import { productsTable } from "../../db/productsSchema.js";
import { usersTable } from "../../db/usersSchema.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { order, items } = req.cleanBody;

    if (!userId) {
      res.status(400).json({ message: "Invalid order data" });
    }

    const [newOrder] = await db
      .insert(ordersTable)
      //@ts-ignore
      .values({ userId: userId })
      .returning();

    //TODO: validate product ids, and take their price from db

    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id,
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({ ...newOrder, items: newOrderItems });
  } catch (e) {
    res.status(500).send(e);
  }
}

// if role is admin, return all orders else return only orders filtered by req.userId
export async function listOrders(req: Request, res: Response) {
  try {
    const orders = await db.select().from(ordersTable);
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function gerOrderById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const orderWithItems = await db
      .select({
        order: ordersTable,
        user: usersTable,
        item: orderItemsTable,
        product: productsTable,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id));

    if (!orderWithItems.length) {
      return res.status(404).send({ message: "Order not found" });
    }

    const mapOrder = (orderData: (typeof orderWithItems)[0]) => ({
      id: orderData.order.id,
      createdAt: orderData.order.createdAt,
      status: orderData.order.status,
    });

    const mapItem = (itemData: (typeof orderWithItems)[0]) => ({
      id: itemData.item?.id,
      quantity: itemData.item?.quantity,
      price: itemData.item?.price,
      product: itemData.product,
    });

    const mapUser = (userData: (typeof orderWithItems)[0]) => ({
      id: userData.user?.id,
      name: userData.user?.name,
      role: userData.user?.role,
      email: userData.user?.email,
      address: userData.user?.address,
    });

    const mergedOrder = {
      ...mapOrder(orderWithItems[0]),
      items: orderWithItems.map(mapItem),
      user: mapUser(orderWithItems[0]),
    };

    res.json(mergedOrder);
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.body)
      .where(eq(ordersTable.id, id))
      .returning();

    if (!updatedOrder) {
      res.status(404).send({ message: "Order not found " });
    } else res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).send(error);
  }
}
