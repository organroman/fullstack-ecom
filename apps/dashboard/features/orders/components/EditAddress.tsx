"use client";
import { Order } from "@/types/types";

import { useState } from "react";
import { PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import OrderDetail from "./OrderDetail";

import { UpdateOrderMutationParams } from "@/api-service/orders/useUpdateOrder";

interface EditAddressProps {
  order: Order;
  updateOrderMutation: UseMutationResult<
    Order,
    Error,
    UpdateOrderMutationParams,
    unknown
  >;
}

const EditAddress = ({ order, updateOrderMutation }: EditAddressProps) => {
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [addressValue, setAddressValue] = useState<string>(
    order.delivery_address
  );

  const enableEditingAddress = () => {
    setIsEditingAddress(true);
  };

  const disableEditingAddress = () => {
    setIsEditingAddress(false);
    setAddressValue(order.delivery_address);
  };

  const handleSave = () => {
    updateOrderMutation.mutate(
      { delivery_address: addressValue || "" },
      { onSuccess: () => setIsEditingAddress(false) }
    );
  };

  return isEditingAddress ? (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          id="address"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center gap-1">
        <Button
          onClick={disableEditingAddress}
          variant="link"
          className="p-0 text-red-500 [&_svg]:size-6"
          size="icon"
        >
          <XIcon className="w-8 h-8" size={40} />
        </Button>
        <Button
          onClick={handleSave}
          variant="link"
          className="p-0 [&_svg]:size-6"
          size="icon"
        >
          <SaveIcon />
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-full relative">
      <OrderDetail title="Address:" value={order?.delivery_address} />
      <Button
        onClick={enableEditingAddress}
        variant="link"
        className="absolute -top-1 right-2 p-0"
        size="icon"
      >
        <PencilIcon />
      </Button>
    </div>
  );
};

export default EditAddress;
