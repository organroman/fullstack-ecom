import { Category } from "@/types/types";

import React from "react";

import Modal from "@/components/Modal";

interface CategoryFormModalProps {
  category?: Category;
}

const CategoryFormModal = ({ category }: CategoryFormModalProps) => {
  return (
    <Modal
      title={category ? "Edit category" : "Create category"}
      descriptionFirst={
        category
          ? "Update the fields and click 'Save'"
          : "fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="create-product"
      isPending={false} // TODO: replace with mutation pending
    >
      Category Form
    </Modal>
  );
};

export default CategoryFormModal;
