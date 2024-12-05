"use client";

import { View } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/Header";

import ProductCard from "@/features/products/components/ProductCard";
import ProductFormModal from "@/features/products/components/ProductFormModal";

import { useCreateProduct, useProductById } from "@/api/products/queries";
import { useDialog } from "@/hooks/use-modal";
import LoadingPage from "@/app/loading";

const ProductDetailsPage = ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useProductById(Number(productId));
  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();

  const { product } = data;

  const view = (searchParams.get("view") || "table") as View;

  const { createProductMutation } = useCreateProduct({
    view,
    closeDialog,
    queryClient,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header
        title="Product details"
        dialogButtonLabel="Create product"
        dialogOpen={dialogOpen}
        dialogHandleOpen={setDialogOpen}
        dialogContent={
          <ProductFormModal productMutation={createProductMutation} />
        }
      />
      <ProductCard product={product} isShowDescription />
    </div>
  );
};

export default ProductDetailsPage;
