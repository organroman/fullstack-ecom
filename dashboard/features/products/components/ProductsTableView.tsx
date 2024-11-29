"use client";

import { ProductType } from "@/types/types";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { listProducts } from "../api/products";
import { DataTable } from "@/components/data-table";
import { productColumns } from "./ProductsColumns";
import LoadingPage from "@/app/loading";

type ProductsPromise = {
  products: ProductType[];
  totalPages: number;
  totalItems: number;
  limit: number;
  page: number;
};

interface ProductsTableViewProps {
  view: string;
  updateQueryParams: (
    newView: string,
    newPag?: number,
    newLimit?: number
  ) => void;
}

const ProductsTableView = ({
  view,
  updateQueryParams,
}: ProductsTableViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading, error } = useQuery<ProductsPromise>({
    queryKey: ["products", page, limit, search],
    queryFn: async () => await listProducts(page, limit, search),
  });
  const { products = [], totalPages = 0, totalItems = 0 } = data || {};

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (!searchParams.get("page")) params.set("page", page.toString());
    if (!searchParams.get("limit")) params.set("limit", limit.toString());
    if (!searchParams.get("view")) params.set("view", view);

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, limit, view, router]);

  const handlePageChange = (newPage: number) => {
    updateQueryParams(view, newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams(view, page, newLimit);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-full border overflow-y-auto rounded-md">
      <DataTable
        data={products}
        columns={productColumns}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        currentPage={page}
        currentLimit={limit}
      />
    </div>
  );
};

export default ProductsTableView;
