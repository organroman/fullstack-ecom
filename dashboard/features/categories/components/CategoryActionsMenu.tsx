import { Category } from "@/types/types";

import { useQueryClient } from "@tanstack/react-query";


import { Dialog } from "@/components/ui/dialog";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";

import Modal from "@/components/Modal";
import { useDialog } from "@/hooks/use-modal";
import CategoryFormModal from "./CategoryFormModal";
import { useUpdateCategory } from "@/api/categories/queries/useUpdateCategory";
import { useDeleteCategory } from "@/api/categories/queries/useDeleteCategory";

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
    id: category.id,
  });

  const { deleteCategoryMutation } = useDeleteCategory({
    closeDialog: closeDeleteDialog,
    queryClient,
  });

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
          action={() => deleteCategoryMutation.mutate(category.slug)}
          isPending={deleteCategoryMutation.isPending}
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
