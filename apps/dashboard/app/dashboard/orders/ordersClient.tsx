"use client";
import { useState } from "react";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";

import { ordersColumns } from "@/features/orders/components/OrdersColumns";
import OrdersFilter from "@/features/orders/components/OrdersFilter";

import { usePaginatedOrders } from "@/api-service/orders/useGetPaginatedOrders";

import ErrorPage from "@/app/error";
import { useQueryParams } from "@/hooks/use-query-params";

const OrdersClient = () => {
  const { page, limit, setParam, getParam, query, ready } = useQueryParams();

  const [selectedStatus, setSelectedStatus] = useState<string>(
    getParam("status") || "All"
  );
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = usePaginatedOrders({
    query,
    enabled: ready,
  });
  const { orders = [], totalPages = 0, total = 0 } = data || {};

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
    setParam("status", status);
  };

  const handleSearch = (value: string) => {
    setParam("search", value);
  };
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
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Orders"
        searchPhrase={search}
        setSearchPhrase={setSearch}
        onSearch={handleSearch}
        filterComponent={
          <OrdersFilter
            selectedStatus={selectedStatus}
            onFilterChange={handleFilterChange}
          />
        }
        createItemVariant={{
          variant: "page",
          btnLabel: "Create order",
          link: "orders/new",
        }}
      />

      <div className="h-full border overflow-y-auto rounded-md">
        <DataTable
          data={orders}
          columns={ordersColumns}
          totalItems={total}
          totalPages={totalPages}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          currentPage={page}
          currentLimit={limit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default OrdersClient;
