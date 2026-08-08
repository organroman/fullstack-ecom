import { Request, Response } from "express";

import {
  listProducts as listProductsService,
  findProductById,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  deleteImage as deleteImageService,
} from "./products.service.js";

export async function listProducts(req: Request, res: Response) {
  const searchPhrase =
    typeof req.query.search === "string" ? req.query.search : "";
  const categoryId =
    typeof req.query.categoryId === "string" ? req.query.categoryId : "";

  const page = Math.max(1, Number(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit as string) || 10),
  );

  if (categoryId && !Number.isInteger(Number(categoryId))) {
    res.status(400).send({ message: "Invalid categoryId" });
    return;
  }

  try {
    const products = await listProductsService({
      searchPhrase,
      categoryId,
      page,
      limit,
    });

    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid product id" });
      return;
    }

    const product = await findProductById(Number(id));

    if (!product) {
      res.status(404).send({ message: "Product not found " });
      return;
    }

    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const newProduct = await createProductService(req.cleanBody);

    res.status(201).json(newProduct);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid product id" });
      return;
    }

    const updatedProduct = await updateProductService(
      Number(id),
      req.cleanBody,
    );

    if (!updatedProduct) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid product id" });
      return;
    }

    const isDeleted = await deleteProductService(Number(id));

    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid image id" });
      return;
    }

    const isDeleted = await deleteImageService(Number(id));

    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Image not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}
