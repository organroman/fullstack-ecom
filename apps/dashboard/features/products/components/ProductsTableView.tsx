"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/DataTable";
import { productColumns } from "./ProductsColumns";
import { usePaginatedProducts } from "@/api-service/products/usePaginatedProducts";

import ErrorPage from "@/app/error";

interface ProductsTableViewProps {
  view: string;
  updateQueryParams: (
    newView: string,
    newSearch?: string,
    newPage?: number,
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

  const { data, isLoading, error } = usePaginatedProducts({
    page,
    limit,
    search,
  });

  const { products = [], totalPages = 0, total = 0 } = data || {};

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (!searchParams.get("page")) params.set("page", page.toString());
    if (!searchParams.get("limit")) params.set("limit", limit.toString());
    if (!searchParams.get("view")) params.set("view", view);

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, limit, router]);

  const handlePageChange = (newPage: number) => {
    updateQueryParams(view, search, newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams(view, search, page, newLimit);
  };

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="h-full border overflow-y-auto rounded-md">
      <DataTable
        data={products}
        columns={productColumns}
        totalItems={total}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        currentPage={page}
        currentLimit={limit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsTableView;
