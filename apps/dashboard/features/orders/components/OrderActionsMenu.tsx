import { EOrderStatus, Order } from "@/types/types";

import { useState } from "react";
import { RefreshCcwIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Dialog } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import Modal from "@/components/Modal";
import { useToken } from "@/components/providers/token-provider";
import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import StatusChangeSelector from "./StatusChangeSelector";

import { useUpdateOrder } from "@/api/orders/useUpdateOrder";

interface OrderActionsMenuProps {
  order: Order;
}

const OrderActionsMenu = ({ order }: OrderActionsMenuProps) => {
  const queryClient = useQueryClient();
  const token = useToken();

  const [isChangeStatusDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<EOrderStatus>(order.status);
  const { updateOrderMutation } = useUpdateOrder({
    token,
    queryClient,
    order,
  });

  const handleClose = () => setIsChangeDialogOpen(false);

  const handleStatusChange = (status: EOrderStatus) => {
    setOrderStatus(status);
  };

  const handleSaveStatus = () => {
    updateOrderMutation.mutate(
      { status: orderStatus },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
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
      <Dialog
        open={isChangeStatusDialogOpen}
        onOpenChange={setIsChangeDialogOpen}
      >
        <Modal
          title={"Update order status"}
          descriptionFirst="Select new order and click 'Save'"
          buttonActionTitle="Save"
          buttonActionTitleContinuous="Saving"
          isPending={updateOrderMutation.isPending}
          action={handleSaveStatus}
        >
          <div className="w-full">
            <StatusChangeSelector
              defaultValue={order.status}
              disabled={updateOrderMutation.isPending}
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
