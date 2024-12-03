import { IOrder } from "@/types/types";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";

import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import OrderFormModal from "./OrderFormModal";

interface OrderActionsMenuProps {
  order: IOrder;
}

const OrderActionsMenu = ({ order }: OrderActionsMenuProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/orders/${order.id}`}
        viewItemTitle="View order"
        editItemDialogOpen={() => setIsEditDialogOpen(true)}
        editItemTitle="Edit order"
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <OrderFormModal order={order} />
      </Dialog>
    </>
  );
};

export default OrderActionsMenu;
