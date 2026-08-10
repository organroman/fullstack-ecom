import { inArray, eq, ilike, or, and } from "drizzle-orm";
import { db } from "../../db/index.js";

import { ordersTable, orderItemsTable } from "../../db/schema/orders.js";
import { usersTable } from "../../db/schema/users.js";
import { productImagesTable } from "../../db/schema/products.js";
import type {
  CreateOrderInput,
  ListOrdersParams,
  OrderItemProduct,
  OrderItemWithProduct,
  OrderWithItemsDetails,
  PaginatedOrdersResponse,
  UpdateOrderInput,
} from "./orders.types.js";
import { productsTable } from "../../db/schema/products.js";
import { Image } from "../products/products.types.js";
import { ALLOWED_ROLES } from "../../utils/constants.js";
import { RoleType } from "../../types/express/index.js";
import { HttpError } from "../../utils/httpError.js";

export async function createOrderWithItems(
  orderData: CreateOrderInput,
): Promise<OrderWithItemsDetails | null> {
  const orderId = await db.transaction(async (tx) => {
    const productIds = orderData.items.map((item) => item.product_id);

    const products = await tx
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const priceByProductId = new Map(products.map((p) => [p.id, p.price]));

    const hasMissingProduct = productIds.some(
      (productId) => !priceByProductId.has(productId),
    );

    if (hasMissingProduct) {
      return null;
    }

    const [newOrder] = await tx
      .insert(ordersTable)
      .values({
        user_id: orderData.order.user_id,
        delivery_address: orderData.order.delivery_address,
        contact_phone: orderData.order.contact_phone,
      })
      .returning({
        id: ordersTable.id,
      });

    const itemsToInsert = orderData.items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: priceByProductId.get(item.product_id)!,
    }));

    await tx.insert(orderItemsTable).values(itemsToInsert);

    return newOrder.id;
  });

  if (!orderId) {
    return null;
  }
  const order = await getOrderWithItemsById(orderId);
  return order;
}

function orderJoinQuery() {
  return db
    .select({
      order: ordersTable,
      user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        address: usersTable.address,
        role: usersTable.role,
      },
      item: orderItemsTable,
      product: productsTable,
      image: productImagesTable,
    })
    .from(ordersTable)
    .innerJoin(usersTable, eq(ordersTable.user_id, usersTable.id))
    .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
    .leftJoin(productsTable, eq(orderItemsTable.product_id, productsTable.id))
    .leftJoin(
      productImagesTable,
      eq(productsTable.id, productImagesTable.product_id),
    );
}

type OrderJoinRow = Awaited<ReturnType<typeof orderJoinQuery>>[number];

function hydrateOrderRows(rows: OrderJoinRow[]): OrderWithItemsDetails[] {
  const orderFieldsById = new Map<
    number,
    Omit<OrderWithItemsDetails, "items">
  >();
  const itemsByOrderId = new Map<number, Map<number, OrderItemWithProduct>>();
  const imagesByProductId = new Map<number, Image[]>();

  for (const row of rows) {
    if (row.image && row.product?.id) {
      const images = imagesByProductId.get(row.product.id) || [];
      images.push({
        id: row.image.id,
        image_link: row.image.image_link,
      });
      imagesByProductId.set(row.product.id, images);
    }
  }

  const mapProduct = (
    productData: OrderJoinRow["product"],
  ): OrderItemProduct | null => {
    if (!productData) {
      return null;
    }

    return {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      images: imagesByProductId.get(productData.id) || [],
    };
  };

  for (const row of rows) {
    const orderId = row.order.id;

    if (!orderFieldsById.has(orderId)) {
      const { user_id: _user_id, ...orderFields } = row.order;
      orderFieldsById.set(orderId, { ...orderFields, user: row.user });
      itemsByOrderId.set(orderId, new Map());
    }

    if (row.item) {
      const items = itemsByOrderId.get(orderId)!;

      if (!items.has(row.item.id)) {
        items.set(row.item.id, {
          id: row.item.id,
          quantity: row.item.quantity,
          price: row.item.price,
          product: mapProduct(row.product),
        });
      }
    }
  }

  return Array.from(orderFieldsById.entries()).map(([orderId, order]) => ({
    ...order,
    items: Array.from(itemsByOrderId.get(orderId)!.values()),
  }));
}

export async function getOrderWithItemsById(
  id: number,
): Promise<OrderWithItemsDetails | null> {
  const rows = await orderJoinQuery().where(eq(ordersTable.id, id));

  if (!rows.length) {
    return null;
  }

  return hydrateOrderRows(rows)[0] ?? null;
}

export async function listOrders({
  page,
  limit,
  searchPhrase,
  status,
  role,
  userId,
}: ListOrdersParams): Promise<PaginatedOrdersResponse> {
  const isSearchNumeric = !isNaN(Number(searchPhrase));
  const offset = (page - 1) * limit;

  const filters = and(
    status ? eq(ordersTable.status, status) : undefined,
    searchPhrase
      ? isSearchNumeric
        ? eq(ordersTable.id, Number(searchPhrase))
        : or(
            ilike(ordersTable.delivery_address, `%${searchPhrase}%`),
            ilike(ordersTable.contact_phone, `%${searchPhrase}%`),
          )
      : undefined,
  );

  const whereClause = ALLOWED_ROLES.includes(role)
    ? filters
    : and(eq(ordersTable.user_id, userId), filters);

  const baseQueryOrdersIds = db
    .selectDistinct({ id: ordersTable.id })
    .from(ordersTable)
    .where(whereClause);

  const [orderIds, totalOrders] = await Promise.all([
    baseQueryOrdersIds.limit(limit).offset(offset),
    db.$count(ordersTable, whereClause),
  ]);

  if (orderIds.length === 0) {
    return {
      orders: [],
      total: 0,
      page,
      totalPages: 0,
      limit,
    };
  }

  const rows = await orderJoinQuery().where(
    inArray(
      ordersTable.id,
      orderIds.map((o) => o.id),
    ),
  );

  const mergedOrders = hydrateOrderRows(rows);

  return {
    orders: mergedOrders,
    total: totalOrders,
    page,
    totalPages: Math.ceil(totalOrders / limit),
    limit,
  };
}

export async function updateOrder({
  id,
  updateOrderInput,
  role,
  userId,
}: {
  id: number;
  updateOrderInput: UpdateOrderInput;
  role: RoleType;
  userId: number;
}): Promise<OrderWithItemsDetails> {
  const updatedOrderId = await db.transaction(async (tx) => {
    const [current] = await tx
      .select({
        id: ordersTable.id,
        status: ordersTable.status,
        user_id: ordersTable.user_id,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .for("update");

    if (!current) {
      throw new HttpError("Order not found", 404);
    }

    const isElevated = ALLOWED_ROLES.includes(role);
    const isOwner = current.user_id === userId;

    if (!isOwner && !isElevated) {
      throw new HttpError("Access denied", 403);
    }

    if (
      current.status === "CANCELLED" ||
      current.status === "SHIPPED" ||
      current.status === "SENT"
    ) {
      throw new HttpError(
        `Cannot update order with status ${current.status}`,
        409,
      );
    }

    const { order, items } = updateOrderInput;

    if (order.status !== undefined && !isElevated) {
      throw new HttpError(
        "Only admins or sales managers can update order status",
        403,
      );
    }

    const existingItems = await tx
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.order_id, id));

    const itemsToInsert = items.filter(
      (item) =>
        !item.id || !existingItems.some((existing) => existing.id === item.id),
    );

    const itemsToInsertMap = itemsToInsert.map((i) => ({
      ...i,
      order_id: id,
    }));

    const itemsToUpdate = items.filter((item) => {
      const existingItem = existingItems.find(
        (existing) => existing.id === item.id,
      );
      return existingItem && existingItem.quantity !== item.quantity;
    });

    const itemsToDelete = existingItems.filter(
      (existing) => !items.some((item) => existing.id == item.id),
    );

    const [updatedOrder] = await tx
      .update(ordersTable)
      .set({ ...order, updated_at: new Date() })
      .where(eq(ordersTable.id, id))
      .returning({
        id: ordersTable.id,
      });

    if (itemsToInsert.length > 0) {
      const productIds = itemsToInsertMap.map((item) => item.product_id);

      const products = await tx
        .select()
        .from(productsTable)
        .where(inArray(productsTable.id, productIds));

      const priceByProductId = new Map(products.map((p) => [p.id, p.price]));

      const hasMissingProduct = productIds.some(
        (productId) => !priceByProductId.has(productId),
      );

      if (hasMissingProduct) {
        throw new HttpError(
          "One or more products in the order were not found",
          400,
        );
      }

      await tx.insert(orderItemsTable).values(
        itemsToInsertMap.map((item) => ({
          ...item,
          price: priceByProductId.get(item.product_id)!,
        })),
      );
    }

    if (itemsToUpdate.length > 0) {
      await Promise.all(
        itemsToUpdate.map((i) =>
          tx
            .update(orderItemsTable)
            .set({ quantity: i.quantity, updated_at: new Date() })
            .where(eq(orderItemsTable.id, i.id!)),
        ),
      );
    }

    if (itemsToDelete.length > 0) {
      await tx.delete(orderItemsTable).where(
        inArray(
          orderItemsTable.id,
          itemsToDelete.map((item) => item.id),
        ),
      );
    }

    return updatedOrder.id;
  });

  const order = await getOrderWithItemsById(updatedOrderId);

  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  return order;
}
