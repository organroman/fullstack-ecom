"use client";

import { useSearchParams } from "next/navigation";

import { DataTable } from "@/components/DataTable";
import { productColumns } from "./ProductsColumns";
import { usePaginatedProducts } from "@/api-service/products/usePaginatedProducts";

import ErrorPage from "@/app/error";

interface ProductsTableViewProps {
  query: string;
  ready: boolean;
  setParam: (key: string, value: string | number) => void;
}

const ProductsTableView = ({
  query,
  ready,
  setParam,
}: ProductsTableViewProps) => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);

  const { data, isLoading, error } = usePaginatedProducts({
    query,
    enabled: ready,
  });

  const { products = [], totalPages = 0, total = 0 } = data || {};

  const handlePageChange = (newPage: number) => {
    setParam("page", newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setParam("limit", newLimit);
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
