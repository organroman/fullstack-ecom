import { EOrderStatus, Order } from "@/types/types";

import { useState } from "react";
import { RefreshCcwIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Dialog } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import Modal from "@/components/Modal";
import { useToken } from "@/components/providers/token-provider";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import OrderFormModal from "./OrderFormModal";
import StatusChangeSelector from "./StatusChangeSelector";

import { useUpdateOrderStatus } from "@/api/orders/useChangeOrderStatus";

interface OrderActionsMenuProps {
  order: Order;
}

const OrderActionsMenu = ({ order }: OrderActionsMenuProps) => {
  const queryClient = useQueryClient();
  const token = useToken();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<EOrderStatus>(order.status);
  const { updateStatus } = useUpdateOrderStatus({
    orderId: order.id,
    token,
    queryClient,
  });

  const handleClose = () => setIsChangeDialogOpen(false);

  const handleStatusChange = (status: EOrderStatus) => {
    setOrderStatus(status);
  };

  const handleSaveStatus = () => {
    updateStatus.mutate(orderStatus, {
      onSuccess: () => {
        handleClose();
      },
    });
  };
  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/orders/${order.id}`}
        viewItemTitle="Open order"
        extraItems={
          <DropdownMenuItem onClick={() => setIsChangeDialogOpen(true)}>
            <RefreshCcwIcon /> Change status
          </DropdownMenuItem>
        }
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <OrderFormModal order={order} />
      </Dialog>
      <Dialog
        open={isChangeStatusDialogOpen}
        onOpenChange={setIsChangeDialogOpen}
      >
        <Modal
          title={"Update order status"}
          descriptionFirst="Select new order and click 'Save'"
          buttonActionTitle="Save"
          buttonActionTitleContinuous="Saving"
          isPending={updateStatus.isPending}
          action={handleSaveStatus}
        >
          <div className="w-full">
            <StatusChangeSelector
              order={order}
              disabled={updateStatus.isPending}
              className="w-full"
              onStatusChange={handleStatusChange}
            />
          </div>
        </Modal>
      </Dialog>
    </>
  );
};

export default OrderActionsMenu;
