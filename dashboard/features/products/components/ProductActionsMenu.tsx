import { ProductFormModalData, ProductType } from "@/types/types";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";

import ProductForm from "./ProductFormModal";
import Modal from "@/components/Modal";

import { handleDeleteProduct, handleUpdateProduct } from "../actions";

const ProductActionsMenu = ({ product }: { product: ProductType }) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const view = searchParams.get("view");

  const editProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: ProductFormModalData) => {
      const data = await handleUpdateProduct(
        product.id,
        name,
        description,
        image,
        price
      );
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await handleDeleteProduct(id);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/products/${product.id}`}
        viewItemTitle="View product"
        editItemDialogOpen={() => setIsEditDialogOpen(true)}
        editItemTitle="Edit product"
        deleteItemDialogOpen={() => setIsDeleteDialogOpen(true)}
        deleteItemTitle="Delete product"
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ProductForm product={product} productMutation={editProductMutation} />
      </Dialog>
    </>
  );
};

export default ProductActionsMenu;
