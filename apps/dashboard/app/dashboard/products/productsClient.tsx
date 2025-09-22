"use client";

import { View } from "@/types/types";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/Header";

import ProductFormModal from "@/features/products/components/ProductFormModal";
import ProductsGridView from "@/features/products/components/ProductsGridView";
import ProductsTableView from "@/features/products/components/ProductsTableView";

import { useDialog } from "@/hooks/use-modal";

import { useCreateProduct } from "@/api-service/products/useCreateProduct";

import { useQueryParams } from "@/hooks/use-query-params";

const ProductsClient = () => {
  const queryClient = useQueryClient();

  const { setParam, getParam, query, ready } = useQueryParams();
  const view = getParam("view") as View;

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const { createProductMutation } = useCreateProduct({
    view,
    closeDialog,
    queryClient,
  });

  const handleView = () => {
    const newView = view === "grid" ? "table" : "grid";

    setParam("view", newView);
    localStorage.setItem("products-view", JSON.stringify(newView));
  };

  const handleSearch = (newSearch: string) => {
    setParam("search", newSearch);
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
        createItemVariant={{
          variant: "modal",
          dialogButtonLabel: "Create product",
          dialogContent: (
            <ProductFormModal productMutation={createProductMutation} />
          ),
          dialogOpen: dialogOpen,
          dialogHandleOpen: setDialogOpen,
        }}
      />

      {view === "grid" ? (
        <ProductsGridView />
      ) : (
        <ProductsTableView query={query} setParam={setParam} ready={ready} />
      )}
    </div>
  );
};

export default ProductsClient;
