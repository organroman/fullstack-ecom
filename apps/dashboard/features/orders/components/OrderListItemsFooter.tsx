import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

interface OrderListItemsFooterProps {
  totalItemsQuantity: number;
  totalAmountOfOrder: number;
  addProductSetDialogOpen?: () => void;
}

const OrderListItemsFooter = ({
  totalItemsQuantity,
  totalAmountOfOrder,
  addProductSetDialogOpen,
}: OrderListItemsFooterProps) => {
  return (
    <div className="grid grid-cols-8 font-bold mt-6 items-center">
      <p className="text-xl text-zinc-700 dark:text-zinc-300 col-span-4">
        Totals
      </p>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">
        {totalItemsQuantity}
      </p>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1">-</p>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 col-span-1 font-bold">
        ${totalAmountOfOrder?.toLocaleString()}
      </p>
      {addProductSetDialogOpen && (
        <Button
          size="icon"
          className="col-span-1 justify-self-end"
          onClick={addProductSetDialogOpen}
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  );
};

export default OrderListItemsFooter;
