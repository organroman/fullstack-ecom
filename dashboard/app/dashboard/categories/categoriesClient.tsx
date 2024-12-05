"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";

import { categoriesColumns } from "@/features/categories/components/CategoriesColumns";
import CategoryFormModal from "@/features/categories/components/CategoryFormModal";

import { useGetCategories } from "@/api/categories/queries";
import { useDialog } from "@/hooks/use-modal";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";



const CategoriesClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const { dialogOpen, setDialogOpen } = useDialog();
  const { data, isLoading, error } = useGetCategories(search);

  const { categories = [] } = data || {};
  const {
    searchPhrase,
    setSearchPhrase,
    handlePageChange,
    handleLimitChange,
    handleSearch,
  } = useUpdateQueryParams({
    search,
    searchParams,
    router,
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Categories"
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        onSearch={handleSearch}
        dialogContent={<CategoryFormModal />}
        dialogButtonLabel="Create category"
        dialogHandleOpen={setDialogOpen}
        dialogOpen={dialogOpen}
      />

      <div className="h-full border overflow-y-auto rounded-md">
        <DataTable
          data={categories}
          columns={categoriesColumns}
          totalItems={10}
          totalPages={1}
          currentLimit={10}
          currentPage={1}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CategoriesClient;
