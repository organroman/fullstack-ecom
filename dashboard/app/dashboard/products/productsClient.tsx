"use client";

import { View } from "@/types/types";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/Header";

import ProductFormModal from "@/features/products/components/ProductFormModal";
import ProductsGridView from "@/features/products/components/ProductsGridView";
import ProductsTableView from "@/features/products/components/ProductsTableView";

import { getDataFromLS } from "@/lib/utils";
import { useDialog } from "@/hooks/use-modal";
import { useCreateProduct } from "@/api/products/queries/useCreateProduct";

const ProductsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const view = (searchParams.get("view") || "table") as View;

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const { createProductMutation } = useCreateProduct({
    view,
    closeDialog,
    queryClient,
  });

  const updateQueryParams = (
    newView: string,
    newSearch?: string,
    newPage?: number,
    newLimit?: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    newPage ? params.set("page", newPage?.toString()) : params.delete("page");
    newLimit
      ? params.set("limit", newLimit?.toString())
      : params.delete("limit");

    params.set("view", newView);

    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const storedView = getDataFromLS("products-view") || "grid";

    if (!searchParams.get("view")) params.set("view", storedView);

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleView = () => {
    const newView = view === "grid" ? "table" : "grid";

    updateQueryParams(newView);
    localStorage.setItem("products-view", JSON.stringify(newView));
  };

  const handleSearch = (newSearch: string) => {
    updateQueryParams(view, newSearch);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Products"
        entityView={view}
        handleEntityView={handleView}
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        onSearch={handleSearch}
        dialogButtonLabel="Create product"
        dialogContent={
          <ProductFormModal productMutation={createProductMutation} />
        }
        dialogOpen={dialogOpen}
        dialogHandleOpen={setDialogOpen}
      
      />

      {view === "grid" ? (
        <ProductsGridView />
      ) : (
        <ProductsTableView view={view} updateQueryParams={updateQueryParams} />
      )}
    </div>
  );
};

export default ProductsClient;
