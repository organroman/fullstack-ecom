"use client";

import { EllipsisIcon } from "lucide-react";

import ItemsListHeaderCell from "./ItemsListHeaderCell";

const OrderItemsListHeader = () => {
  return (
    <div className="grid grid-cols-8 mb-4 font-semibold">
      <ItemsListHeaderCell children="Image" />
      <ItemsListHeaderCell
        children="Name"
        styles="text-lg text-zinc-700 dark:text-zinc-300 col-span-3"
      />
      <ItemsListHeaderCell children="Quantity" />
      <ItemsListHeaderCell children="Price" />
      <ItemsListHeaderCell children="Total" />

      <EllipsisIcon className="size-6 col-span-1 justify-self-end  text-zinc-700 dark:text-zinc-300" />
    </div>
  );
};

export default OrderItemsListHeader;
