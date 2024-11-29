"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getDataFromLS } from "@/lib/utils";

import ProductsGridView from "@/features/products/components/ProductsGridView";
import ProductsTableView from "@/features/products/components/ProductsTableView";
import ProductsHeader from "@/features/products/components/ProductsHeader";

const ProductsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchPhrase, setSearchPhrase] = useState("");

  const view = searchParams.get("view") || "grid";

  const updateQueryParams = (
    newView: string,
    newPage?: number,
    newLimit?: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    newPage ? params.set("page", newPage?.toString()) : params.delete("page");
    newLimit
      ? params.set("limit", newLimit?.toString())
      : params.delete("limit");
    params.set("view", newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const storedView = getDataFromLS("products-view") || "grid";

    if (!searchParams.get("view")) params.set("view", storedView);

    if (params.toString() !== searchParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, view, router]);

  const handleView = () => {
    const newView = view === "grid" ? "table" : "grid";

    updateQueryParams(newView);
    localStorage.setItem("products-view", JSON.stringify(newView));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <ProductsHeader
        view={view}
        handleView={handleView}
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
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
