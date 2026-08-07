import { and, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { productImagesTable, productsTable } from "../../db/schema/products.js";
import type {
  CreateProductInput,
  FullProduct,
  ListProductsParams,
  MappedProduct,
  PaginatedProductsResponse,
  UpdateProductInput,
} from "./products.types.js";

export async function listProducts({
  searchPhrase,
  categoryId,
  page,
  limit,
}: ListProductsParams): Promise<PaginatedProductsResponse> {
  const offset = (page - 1) * limit;

  const whereClause = and(
    ilike(productsTable.name, `%${searchPhrase}%`),
    categoryId ? eq(productsTable.category_id, Number(categoryId)) : undefined,
  );

  const [productIds, totalProducts] = await Promise.all([
    db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset),
    db.$count(productsTable, whereClause),
  ]);

  const productsWithImages = await db
    .select()
    .from(productsTable)
    .where(
      inArray(
        productsTable.id,
        productIds.map((p) => p.id),
      ),
    )
    .leftJoin(
      productImagesTable,
      eq(productsTable.id, productImagesTable.product_id),
    );

  const mappedResults = productsWithImages.reduce<MappedProduct[]>(
    (acc, row) => {
      const existingProduct = acc.find(
        (product) => product.id === row?.products?.id,
      );

      if (existingProduct) {
        if (row.product_images) {
          const imageExists = existingProduct.images.some(
            (img) => img.id === row.product_images?.id,
          );

          if (!imageExists) {
            existingProduct.images.push({
              id: row.product_images.id,
              image_link: row.product_images.image_link,
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
                },
              ]
            : [],
        });
      }

      return acc;
    },
    [],
  );
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products: mappedResults,
    total: totalProducts,
    page,
    totalPages,
    limit,
  };
}

export async function findProductById(id: number): Promise<FullProduct | null> {
  const rows = await db
    .select({
      product: productsTable,
      image: productImagesTable,
    })
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .leftJoin(
      productImagesTable,
      eq(productsTable.id, productImagesTable.product_id),
    );

  const result = rows.reduce<FullProduct | null>((acc, row) => {
    if (!row.product) {
      return acc;
    }
    if (!acc) {
      acc = {
        id: row.product.id,
        name: row.product.name,
        description: row.product.description,
        price: row.product.price,
        category_id: row.product.category_id,
        images: [],
        created_at: row.product.created_at,
        updated_at: row.product.updated_at,
      };
    }
    if (row.image) {
      acc.images.push({
        id: row.image.id,
        image_link: row.image.image_link,
      });
    }
    return acc;
  }, null);

  return result;
}

export async function createProduct(
  productBody: CreateProductInput,
): Promise<FullProduct> {
  const { product, images } = productBody;

  return db.transaction(async (tx) => {
    const [newProduct] = await tx
      .insert(productsTable)
      .values(product)
      .returning();

    const productImages = images.map((image: { image_link: string }) => ({
      ...image,
      product_id: newProduct.id,
    }));

    const newProductImages = productImages.length
      ? await tx.insert(productImagesTable).values(productImages).returning()
      : [];

    return {
      ...newProduct,
      images: newProductImages.map((image) => ({
        id: image.id,
        image_link: image.image_link,
      })),
    };
  });
}

export async function updateProduct(
  id: number,
  productBody: UpdateProductInput,
): Promise<FullProduct | null> {
  const { product, images } = productBody;

  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({
        id: productsTable.id,
      })
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .for("update");

    if (!current) {
      return null;
    }

    const [updatedProduct] = await tx
      .update(productsTable)
      .set({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        updated_at: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    const existingImages = await tx
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.product_id, id));

    const productImages = images.map((image) => ({
      ...image,
      product_id: id,
    }));

    const imagesToInsert = productImages.filter(
      (image) =>
        !image.id ||
        !existingImages.some((existing) => existing.id === image.id),
    );

    const imagesToDelete = existingImages.filter(
      (existing) => !productImages.some((image) => image.id === existing.id),
    );

    const insertedImages = imagesToInsert.length
      ? await tx.insert(productImagesTable).values(imagesToInsert).returning()
      : [];

    if (imagesToDelete.length > 0) {
      await tx.delete(productImagesTable).where(
        inArray(
          productImagesTable.id,
          imagesToDelete.map((img) => img.id),
        ),
      );
    }

    return {
      ...updatedProduct,
      images: [
        ...existingImages
          .filter((img) => !imagesToDelete.some((del) => del.id === img.id))
          .map((img) => ({ id: img.id, image_link: img.image_link })),
        ...insertedImages.map((img) => ({
          id: img.id,
          image_link: img.image_link,
        })),
      ],
    };
  });
}

export async function deleteProduct(id: number): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx
      .delete(productImagesTable)
      .where(eq(productImagesTable.product_id, id));

    const [deletedProduct] = await tx
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    return !!deletedProduct;
  });
}

export async function deleteImage(id: number): Promise<boolean> {
  const deletedCount = await db
    .delete(productImagesTable)
    .where(eq(productImagesTable.id, id))
    .returning();

  return deletedCount.length > 0;
}
