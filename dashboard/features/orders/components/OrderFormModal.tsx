import Modal from "@/components/Modal";
import { Order } from "@/types/types";
import React from "react";

interface OrderFormModalProps {
  order?: Order;
}

const OrderFormModal = ({ order }: OrderFormModalProps) => {
  return (
    <Modal
      title={order ? "Edit order" : "Create order"}
      descriptionFirst={
        order
          ? "Update the fields and click 'Save'"
          : "fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="create-product"
      isPending={false} // TODO: replace with mutation pending
    >
      Order Form
    </Modal>
  );
};

export default OrderFormModal;
