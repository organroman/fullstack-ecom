"use client";
import { ProductType } from "@/types/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { handleDeleteProduct } from "../actions";

interface DeleteProductModalProps {
  product: ProductType;
  onClose: Dispatch<SetStateAction<boolean>>;
}

const DeleteProductModal = ({ product, onClose }: DeleteProductModalProps) => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await handleDeleteProduct(id);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      onClose(false);
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="flex flex-col justify-center text-center">
        <DialogTitle className="text-red-500 text-center text-xl">
          Delete product
        </DialogTitle>
        <DialogDescription className="text-center text-md">
          Are you sure you want to delete product?
        </DialogDescription>
        <DialogDescription className="text-sm font-bold text-center">
          This action can&apos;t be undone!
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="sm:justify-start w-full mt-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={deleteProductMutation.isPending}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={() => deleteProductMutation.mutate(product.id)}
          className="w-full"
          variant="destructive"
          disabled={deleteProductMutation.isPending}
        >
          {deleteProductMutation.isPending ? (
            <div className="flex flex-row">
              <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
              <span>Deleting</span>
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteProductModal;
