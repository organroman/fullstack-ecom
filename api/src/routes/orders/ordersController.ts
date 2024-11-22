import { Request, Response } from "express";

import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js";
import { and, eq } from "drizzle-orm";
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
    console.log("🚀 ~ orders:", orders);
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getOrderById(req: Request, res: Response) {
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
      res.status(404).send({ message: "Order not found" });
      return;
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

export async function gerOrderByIdAndUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    const orderId = parseInt(req.params.orderId);

    const orderWithItems = await db
      .select({
        order: ordersTable,
        item: orderItemsTable,
        product: productsTable,
      })
      .from(ordersTable)
      .where(and(eq(ordersTable.userId, userId), eq(ordersTable.id, orderId)))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id));

    if (!orderWithItems.length) {
      res.status(404).send({ message: "Order not found" });
      return;
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

    const mergedOrder = {
      ...mapOrder(orderWithItems[0]),
      items: orderWithItems.map(mapItem),
    };

    res.json(mergedOrder);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function gerOrdersByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);

    const ordersWithItems = await db
      .select({
        order: ordersTable,
        item: orderItemsTable,
        product: productsTable,
      })
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id));

    if (!ordersWithItems.length) {
      res.status(404).send({ message: "Order not found" });
      return;
    }

    const ordersMap = new Map<number, any>();

    ordersWithItems.forEach((row) => {
      const orderId = row.order.id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: orderId,
          createdAt: row.order.createdAt,
          status: row.order.status,
          userId: row.order.userId,
          items: [],
        });
      }

      const item = {
        id: row.item?.id,
        quantity: row.item?.quantity,
        price: row.item?.price,
        product: row.product,
      };

      ordersMap.get(orderId).items.push(item);
    });

    const mergedOrders = Array.from(ordersMap.values());

    res.status(200).json(mergedOrders);
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
