"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import LoadingPage from "@/app/loading";

import { DataTable } from "@/components/DataTable";
import OrdersHeader from "@/features/orders/components/OrdersHeader";
import { fetchOrders } from "@/features/orders/api/orders";
import { ordersColumns } from "@/features/orders/components/OrdersColumns";

const OrdersClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchPhrase, setSearchPhrase] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const { data, isPending, error } = useQuery({
    queryKey: ["orders", page, limit, search, status],
    queryFn: async () => await fetchOrders(page, limit, search, status),
  });

  const { orders = [], totalPages = 0, totalItems = 0 } = data || {};

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (!searchParams.get("page")) params.set("page", page.toString());
    if (!searchParams.get("limit")) params.set("limit", limit.toString());

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, limit, router]);

  const updateQueryParams = (newPage?: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    newPage ? params.set("page", newPage?.toString()) : params.delete("page");
    newLimit
      ? params.set("limit", newLimit?.toString())
      : params.delete("limit");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams(newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams(page, newLimit);
  };

  if (isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <OrdersHeader
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        title="Orders"
      />
      <div className="h-full border overflow-y-auto rounded-md">
        <DataTable
          data={orders}
          columns={ordersColumns}
          totalItems={totalItems}
          totalPages={totalPages}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          currentPage={page}
          currentLimit={limit}
        />
      </div>
    </div>
  );
};

export default OrdersClient;
