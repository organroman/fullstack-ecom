"use client";
import { ProductType } from "@/types/types";

import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Modal from "@/components/Modal";

import { handleDeleteProduct } from "../actions";

interface DeleteProductModalProps {
  product: ProductType;
  onClose: Dispatch<SetStateAction<boolean>>;
}

const DeleteProductModal = ({ product, onClose }: DeleteProductModalProps) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const view = searchParams.get("view");

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await handleDeleteProduct(id);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      onClose(false);
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Modal
      title="Delete product"
      descriptionFirst="Are you sure you want to delete product?"
      descriptionSecond="This action can't be undone!"
      buttonActionTitle="Delete"
      buttonActionTitleContinuous="Deleting"
      actionId={product.id}
      action={() => deleteProductMutation.mutate(product.id)}
      isPending={deleteProductMutation.isPending}
      destructive
    />
  );
};

export default DeleteProductModal;
