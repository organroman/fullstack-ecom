import _ from "lodash";
import { Request, Response } from "express";
import { count, eq, ilike } from "drizzle-orm";

import { db } from "../../db/index.js";
import { productImagesTable, productsTable } from "../../db/schema/products.js";

export async function listProducts(req: Request, res: Response) {
  try {
    const searchPhrase = req.query.search || "";

    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const products = await db
      .select()
      .from(productsTable)
      .where(
        // or(
        ilike(productsTable.name, `%${searchPhrase}%`)
        // ilike(productsTable.description, `${searchPhrase}`)
        // )
      )
      .limit(limit)
      .offset(offset);

    const totalProducts = await db
      .select({ count: count() })
      .from(productsTable);

    const totalPages = Math.ceil(totalProducts[0].count / limit);

    res.status(200).json({
      products,
      total: totalProducts[0].count,
      page,
      totalPages,
      limit,
    });
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)));

    if (!product) {
      res.status(404).send({ message: "Product not found " });
    } else res.json(product);
  } catch (e) {
    res.status(500).send(e);
  }
}
type ImageType = {
  image_link: string;
};

export async function createProduct(req: Request, res: Response) {
  try {
    const { product, images } = req.cleanBody;
    console.log(req.cleanBody);
    console.log("🚀 ~ images:", images);
    console.log("🚀 ~ product:", product);

    const [newProduct] = await db
      .insert(productsTable)
      .values(product)
      .returning();

    const productImages = images.map((image: ImageType) => ({
      ...image,
      product_id: newProduct.id,
    }));

    const newProductImages = await db
      .insert(productImagesTable)
      .values(productImages)
      .returning();

    res.status(201).json({ ...newProduct, images: newProductImages });
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.cleanBody;
    updatedFields.updated_at = new Date();

    const [product] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
