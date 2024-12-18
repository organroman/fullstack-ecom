"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";

import { ordersColumns } from "@/features/orders/components/OrdersColumns";
import OrderFormModal from "@/features/orders/components/OrderFormModal";
import OrdersFilter from "@/features/orders/components/OrdersFilter";

import { usePaginatedOrders } from "@/api/orders/queries";

import { useDialog } from "@/hooks/use-modal";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";

const OrdersClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [selectedStatus, setSelectedStatus] = useState<string>(status || "All");
  const { dialogOpen, setDialogOpen } = useDialog();
  const { data, isLoading, error } = usePaginatedOrders(
    page,
    limit,
    search,
    status
  );

  const { orders = [], totalPages = 0, totalItems = 0 } = data || {};

  const {
    searchPhrase,
    setSearchPhrase,
    handlePageChange,
    handleLimitChange,
    handleStatusChange,
    handleSearch,
  } = useUpdateQueryParams({
    search,
    searchParams,
    page,
    limit,
    router,
  });

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
    handleStatusChange(status);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Orders"
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        onSearch={handleSearch}
        filterComponent={
          <OrdersFilter
            selectedStatus={selectedStatus}
            onFilterChange={handleFilterChange}
          />
        }
        dialogContent={<OrderFormModal />}
        dialogButtonLabel="Create Order"
        dialogOpen={dialogOpen}
        dialogHandleOpen={setDialogOpen}
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default OrdersClient;
