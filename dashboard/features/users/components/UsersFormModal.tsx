import Modal from "@/components/Modal";
import { IUser } from "@/types/types";
import React from "react";

interface UserFormModalProps {
  user?: IUser;
}

const UsersFormModal = ({ user }: UserFormModalProps) => {
  return (
    <Modal
      title={user ? "Edit user" : "Create user"}
      descriptionFirst={
        user
          ? "Update the fields and click 'Save'"
          : "fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="create-product"
      isPending={false} // TODO: replace with mutation pending
    >
      User Form
    </Modal>
  );
};

export default UsersFormModal;
