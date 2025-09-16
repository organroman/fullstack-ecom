import _ from "lodash";
import { Request, Response } from "express";
import { and, count, eq, ilike, inArray } from "drizzle-orm";

import { db } from "../../db/index.js";
import { productImagesTable, productsTable } from "../../db/schema/products.js";

type MappedProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  images: Image[];
};
export async function listProducts(req: Request, res: Response) {
  try {
    const searchPhrase = req.query.search || "";
    const categoryId = req.query.categoryId || "";

    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const paginatedProducts = await db

      .select()
      .from(productsTable)
      .where(
        and(
          // or(
          ilike(productsTable.name, `%${searchPhrase}%`),
          // ilike(productsTable.description, `${searchPhrase}`)
          // )
          categoryId
            ? eq(productsTable.category_id, Number(categoryId))
            : undefined
        )
      )
      .limit(limit)
      .offset(offset);

    const productIds = paginatedProducts.map((product) => product.id);

    const productsWithImages = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds))
      .leftJoin(
        productImagesTable,
        eq(productsTable.id, productImagesTable.product_id)
      );

    const mappedResults = productsWithImages.reduce<MappedProduct[]>(
      (acc, row) => {
        const existingProduct = acc.find(
          (product) => product.id === row?.products?.id
        );

        if (existingProduct) {
          if (row.product_images) {
            const imageExists = existingProduct.images.some(
              (img) => img.id === row.product_images?.id
            );

            if (!imageExists) {
              existingProduct.images.push({
                id: row.product_images.id,
                image_link: row.product_images.image_link,
                product_id: row.product_images.product_id,
              });
            }
          }
        } else {
          acc.push({
            id: row.products.id,
            name: row.products.name,
            description: row.products.description,
            price: row.products.price,
            category_id: row.products.category_id,
            images: row.product_images
              ? [
                  {
                    id: row.product_images.id,
                    image_link: row.product_images.image_link,
                    product_id: row.product_images.product_id,
                  },
                ]
              : [],
          });
        }

        return acc;
      },
      []
    );
    const totalProducts = await db
      .select({ count: count() })
      .from(productsTable)
      .where(ilike(productsTable.name, `%${searchPhrase}%`));

    const totalPages = Math.ceil(totalProducts[0].count / limit);

    res.status(200).json({
      products: mappedResults,
      total: totalProducts[0].count,
      page,
      totalPages,
      limit,
    });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong", error: e });
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
      return;
    }

    const productImages = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.product_id, Number(id)));

    const productWithImages = { ...product, images: productImages };

    res.status(200).json(productWithImages);
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
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

type Image = {
  id: number;
  product_id: number;
  image_link: string;
};

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { product, images } = req.body;

    product.updated_at = new Date();

    const [updatedProduct] = await db
      .update(productsTable)
      .set({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        updated_at: product.updated_at,
      })
      .where(eq(productsTable.id, id))
      .returning();

    const existingImages = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.product_id, id));

    const productImages = images.map((image: ImageType & { id?: number }) => ({
      ...image,
      product_id: product.id,
    }));

    const imagesToInsert = productImages.filter(
      (image: ImageType & { id: number }) =>
        !image.id ||
        !existingImages.some((existing) => existing.id === image.id)
    );

    if (imagesToInsert.length > 0) {
      await db.insert(productImagesTable).values(imagesToInsert);
    }

    const updatedImages = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.product_id, id));

    if (updatedProduct) {
      res.json({ ...updatedProduct, images: updatedImages });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const imagesToDelete = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.product_id, id));

    imagesToDelete.forEach(async (image: Image) => {
      await db
        .delete(productImagesTable)
        .where(eq(productImagesTable.id, image.id));
    });

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
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const deletedImage = await db
      .delete(productImagesTable)
      .where(eq(productImagesTable.id, id));

    if (deletedImage) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Image not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Something went wrong", error: e });
  }
}
