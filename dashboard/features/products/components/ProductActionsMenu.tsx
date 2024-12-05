import { ProductType, View } from "@/types/types";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";

import ProductForm from "./ProductFormModal";
import Modal from "@/components/Modal";
import { useDeleteProduct, useEditProduct } from "@/api/products/queries";
import { useDialog } from "@/hooks/use-modal";

const ProductActionsMenu = ({ product }: { product: ProductType }) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const {
    dialogOpen: isEditDialogOpen,
    setDialogOpen: setIsEditDialogOpen,
    closeDialog: closeEditDialog,
  } = useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const view = searchParams.get("view") as View;

  const { editProductMutation } = useEditProduct({
    id: product.id,
    closeDialog: closeEditDialog,
    queryClient,
    view,
  });

  const { deleteProductMutation } = useDeleteProduct({
    closeDialog: closeDeleteDialog,
    queryClient,
    view,
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