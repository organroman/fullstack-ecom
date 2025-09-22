"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import { useToken } from "@/components/providers/token-provider";
import ErrorPage from "@/app/error";

import { categoriesColumns } from "@/features/categories/components/CategoriesColumns";
import CategoryFormModal from "@/features/categories/components/CategoryFormModal";

import { useGetCategories } from "@/api-service/categories/useGetCategories";
import { useCreateCategory } from "@/api-service/categories/useCreateCategory";

import { useDialog } from "@/hooks/use-modal";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";

const CategoriesClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const token = useToken();

  const search = searchParams.get("search") || "";

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const { data, isLoading, error } = useGetCategories({ search, token });
  const { createCategoryMutation } = useCreateCategory({
    closeDialog,
    queryClient,
    token,
  });

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

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Categories"
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        onSearch={handleSearch}
        createItemVariant={{
          variant: "modal",
          dialogContent: (
            <CategoryFormModal categoryMutation={createCategoryMutation} />
          ),
          dialogButtonLabel: "Create category",
          dialogHandleOpen: setDialogOpen,
          dialogOpen: dialogOpen,
        }}
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
