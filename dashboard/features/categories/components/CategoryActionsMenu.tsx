import { Category, ProductFormModalData } from "@/types/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";

import Modal from "@/components/Modal";
import { useDialog } from "@/hooks/use-modal";
import CategoryFormModal from "./CategoryFormModal";
import { useUpdateCategory } from "@/api/categories/queries/useUpdateCategory";

const CategoryActionMenu = ({ category }: { category: Category }) => {
  const queryClient = useQueryClient();
  const {
    dialogOpen: isEditDialogOpen,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    setDialogOpen: setEditDialogOpen,
  } = useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    setDialogOpen: setDeleteDialogOpen,
  } = useDialog();

  const { editCategoryMutation } = useUpdateCategory({
    closeDialog: closeEditDialog,
    queryClient,
  });

  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const editProductMutation = useMutation<void, Error, ProductFormModalData>({
  //   mutationFn: async ({
  //     name,
  //     description,
  //     price,
  //     image,
  //   }: ProductFormModalData) => {
  //     const data = await handleUpdateProduct(
  //       product.id,
  //       name,
  //       description,
  //       image,
  //       price
  //     );
  //     return data;
  //   },

  //   onSuccess: () => {
  //     toast.success("Product has been deleted");
  //     closeEditDialog();
  //     queryClient.invalidateQueries({
  //       queryKey: [view === "table" ? "products" : "products-infinite"],
  //     });
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  // const deleteProductMutation = useMutation({
  //   mutationFn: async (id: number) => {
  //     const data = await handleDeleteProduct(id);
  //     return data;
  //   },

  //   onSuccess: () => {
  //     toast.success("Product has been deleted");
  //     closeDeleteDialog();
  //     queryClient.invalidateQueries({
  //       queryKey: [view === "table" ? "products" : "products-infinite"],
  //     });
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/categories/${category.slug}`}
        viewItemTitle="View Category"
        editItemDialogOpen={() => openEditDialog()}
        editItemTitle="Edit Category"
        deleteItemDialogOpen={() => openDeleteDialog()}
        deleteItemTitle="Delete Category"
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Modal
          title="Delete Category"
          descriptionFirst="Are you sure you want to delete Category?"
          descriptionSecond="This action can't be undone!"
          buttonActionTitle="Delete"
          buttonActionTitleContinuous="Deleting"
          actionId={category.id}
          action={() => console.log("deleted")}
          // isPending={deleteProductMutation.isPending}
          isPending={false}
          destructive
        />
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <CategoryFormModal
          category={category}
          categoryMutation={editCategoryMutation}
        />
      </Dialog>
    </>
  );
};

export default CategoryActionMenu;
