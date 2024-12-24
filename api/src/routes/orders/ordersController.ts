import { ALLOWED_ROLES } from "./../../utils/constants";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/schema/orders.js";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { productImagesTable, productsTable } from "../../db/schema/products.js";
import { usersTable } from "../../db/schema/users.js";
import { TokenPayload } from "../../middlewares/authMiddleware.js";
import { OrderStatusType, RoleType } from "../../types/express";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { order, items } = req.cleanBody;
    const { delivery_address, contact_phone } = order;

    console.log(items, items, contact_phone);

    if (!userId || !delivery_address || !contact_phone) {
      res.status(400).json({ message: "Invalid order data" });
      return;
    }

    const [newOrder] = await db
      .insert(ordersTable)
      //@ts-ignore
      .values({
        user_id: userId,
        delivery_address,
        contact_phone,
      })
      .returning();

    //TODO: validate product ids, and take their price from db

    const orderItems = items.map((item: any) => ({
      ...item,
      order_id: newOrder.id,
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({ ...newOrder, items: newOrderItems });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export interface ProductImage {
  id: number;
  image_link: string;
}
export interface Product {
  id: number;
  name: string;
  description: string | null;
  images?: ProductImage[];
}

export interface Item {
  id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
}

export interface Order {
  id: number;
  created_at: Date | null;
  status: OrderStatusType;
  deliveryAddress: string;
  phone: string;
  user: User | null;
  items: Item[];
}

export async function listOrders(req: Request, res: Response) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(401).json({ error: "Access denied" });
      return;
    }

    const decoded = jwt.verify(token, "your-secret") as TokenPayload;
    const userId = Number(decoded.userId);
    const role = decoded.role;

    const searchPhrase = ((req.query.search as string) || "").trim();
    const isSearchNumeric = !isNaN(Number(searchPhrase));
    const status = req.query.status as OrderStatusType | undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const baseQuery = ALLOWED_ROLES.includes(role as RoleType)
      ? db
          .selectDistinct({
            id: ordersTable.id,
            createdAt: ordersTable.created_at,
            status: ordersTable.status,
            userId: ordersTable.user_id,
          })
          .from(ordersTable)
          .where(
            and(
              searchPhrase
                ? isSearchNumeric
                  ? eq(ordersTable.id, Number(searchPhrase))
                  : undefined
                : undefined,
              status ? eq(ordersTable.status, status) : undefined
            )
          )
      : db
          .selectDistinct({
            id: ordersTable.id,
            createdAt: ordersTable.created_at,
            status: ordersTable.status,
            userId: ordersTable.user_id,
          })
          .from(ordersTable)
          .where(eq(ordersTable.user_id, userId));

    const paginatedOrders = await baseQuery
      .orderBy(desc(ordersTable.created_at))
      .limit(limit)
      .offset(offset);

    if (!paginatedOrders.length) {
      res.status(404).send({ message: "No orders found" });
      return;
    }

    const orderIds = paginatedOrders.map((order) => order.id);

    const ordersWithItems = await db
      .select({
        order: ordersTable,
        item: orderItemsTable,
        product: productsTable,
        user: usersTable,
        image: productImagesTable,
      })
      .from(ordersTable)
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
      .leftJoin(productsTable, eq(orderItemsTable.product_id, productsTable.id))
      .leftJoin(usersTable, eq(ordersTable.user_id, usersTable.id))
      .leftJoin(
        productImagesTable,
        eq(productImagesTable.product_id, productsTable.id)
      )
      .where(inArray(ordersTable.id, orderIds));

    const ordersMap = new Map<number, Order>();

    ordersWithItems.forEach((row) => {
      const orderId = row.order.id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: orderId,
          created_at: row.order.created_at,
          status: row.order.status,
          deliveryAddress: row.order.delivery_address,
          phone: row.order.contact_phone,

          user: row.user
            ? {
                id: row.user.id,
                name: row.user.name,
                email: row.user.email,
                phone: row.user.phone,
                address: row.user.address,
              }
            : null,
          items: [],
        });
      }

      if (row.item) {
        const productId = row.product?.id;

        const existingItem = ordersMap
          .get(orderId)!
          .items.find((item) => item.product?.id === productId);

        if (existingItem) {
          if (row.image) {
            existingItem.product!.images!.push({
              id: row.image.id,
              image_link: row.image.image_link,
            });
          }
        } else {
          const item: Item = {
            id: row.item.id,
            quantity: row.item.quantity,
            price: row.item.price,
            product: row.product
              ? {
                  id: row.product.id,
                  name: row.product.name,
                  description: row.product.description,
                  images: row.image
                    ? [
                        {
                          id: row.image.id,
                          image_link: row.image.image_link,
                        },
                      ]
                    : [],
                }
              : undefined,
          };

          ordersMap.get(orderId)!.items.push(item);
        }
      }
    });

    const mergedOrders = Array.from(ordersMap.values());

    const totalOrdersQuery = ALLOWED_ROLES.includes(role as RoleType)
      ? db.select({ count: count() }).from(ordersTable)
      : db
          .select({ count: count() })
          .from(ordersTable)
          .where(eq(ordersTable.user_id, userId));

    const totalOrders = await totalOrdersQuery;
    const totalPages = Math.ceil(totalOrders[0].count / limit);

    res.status(200).json({
      orders: mergedOrders,
      total: totalOrders[0].count,
      page,
      totalPages,
      limit,
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error: error });
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
        image: productImagesTable,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
      .leftJoin(productsTable, eq(orderItemsTable.product_id, productsTable.id))
      .leftJoin(
        productImagesTable,
        eq(productsTable.id, productImagesTable.product_id)
      )
      .leftJoin(usersTable, eq(ordersTable.user_id, usersTable.id));

    if (!orderWithItems.length) {
      res.status(404).send({ message: "Order not found" });
      return;
    }

    const imagesByProductId: Record<number, ProductImage[]> = {};
    orderWithItems.forEach((row) => {
      if (row.image && row.product?.id) {
        const productId = row.product.id;
        if (!imagesByProductId[productId]) {
          imagesByProductId[productId] = [];
        }
        imagesByProductId[productId].push(row.image);
      }
    });

    const mapOrder = (orderData: (typeof orderWithItems)[0]) => ({
      ...orderData.order,
    });

    const mapProduct = (productData: (typeof orderWithItems)[0]) => {
      const productId = productData.product?.id; // Extract the product ID safely
      return {
        id: productId,
        name: productData.product?.name,
        price: productData.product?.price,
        description: productData.product?.description,
        images: productId ? imagesByProductId[productId] || [] : [], // Use the product ID only if it exists
      };
    };

    const itemsMap = new Map<number, any>();
    orderWithItems.forEach((row) => {
      if (row.item?.id) {
        if (!itemsMap.has(row.item.id)) {
          itemsMap.set(row.item.id, {
            id: row.item.id,
            quantity: row.item.quantity,
            price: row.item.price,
            product: mapProduct(row),
          });
        }
      }
    });
    const items = Array.from(itemsMap.values());

    const mapUser = (userData: (typeof orderWithItems)[0]) => ({
      id: userData.user?.id,
      name: userData.user?.name,
      role: userData.user?.role,
      email: userData.user?.email,
      address: userData.user?.address,
    });

    const mergedOrder = {
      ...mapOrder(orderWithItems[0]),
      items,
      user: mapUser(orderWithItems[0]),
    };
    console.log(mergedOrder);

    res.json(mergedOrder);
  } catch (e) {
    res.status(500).send({ message: "Something went wrong", error: e });
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
    res.status(500).send({ message: "Something went wrong", error: error });
  }
}
