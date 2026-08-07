import {
  createProductWithImagesSchema,
  updateProductWithImagesSchema,
} from "../../db/schema/products";
import { z } from "zod";

export type Image = {
  id: number;
  image_link: string;
};

export type MappedProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  images: Image[];
};

export type PaginatedProductsResponse = {
  products: MappedProduct[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

export type ListProductsParams = {
  searchPhrase: string;
  categoryId: string;
  page: number;
  limit: number;
};

export type FullProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  images: Image[];
  created_at: Date;
  updated_at: Date | null;
};

export type CreateProductInput = z.infer<typeof createProductWithImagesSchema>;

export type UpdateProductInput = z.infer<typeof updateProductWithImagesSchema>;
