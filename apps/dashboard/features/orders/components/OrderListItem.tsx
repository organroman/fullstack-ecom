import { Button } from "@/components/ui/button";
import { OrderItem } from "@/types/types";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface OrderListItemProps {
  item: OrderItem;
  isRemoveBtnShown: boolean;
  handleRemoveProduct: (item: OrderItem) => void;
  handleQuantity: (id: number, action: "plus" | "minus") => void;
}

const OrderListItem = ({
  item,
  isRemoveBtnShown,
  handleRemoveProduct,
  handleQuantity,
}: OrderListItemProps) => {
  return (
    <div className="grid grid-cols-8 font-semibold items-center overflow-y-auto">
      <Image
        src={item.product.images[0].image_link}
        width={40}
        height={40}
        alt={item.product.name}
        className="w-20 aspect-square col-span-1 mb-2"
      />
      <p className="text-md text-neutral-400 col-span-3">{item.product.name}</p>
      <div className="flex flex-row items-center gap-2">
        <Button
          disabled={item.quantity <= 1}
          className="p-1 h-6"
          variant="outline"
          onClick={() => handleQuantity(item.product.id, "minus")}
        >
          <MinusIcon className="p-0" />
        </Button>
        <p className="text-md text-neutral-400 col-span-1">{item.quantity}</p>
        <Button
          className="p-1 h-6"
          variant="outline"
          onClick={() => handleQuantity(item.product.id, "plus")}
        >
          <PlusIcon />
        </Button>
      </div>
      <p className="text-md text-neutral-400 col-span-1">
        ${item.price.toLocaleString()}
      </p>
      <p className="text-md text-neutral-400 col-span-1">
        ${(item.quantity * item.price).toLocaleString()}
      </p>
      {isRemoveBtnShown && (
        <Button
          variant="destructive"
          size="icon"
          className="col-span-1 justify-self-end"
          onClick={() => handleRemoveProduct(item)}
        >
          <MinusIcon />
        </Button>
      )}
    </div>
  );
};

export default OrderListItem;
