import { Order, OrderItem, Product } from "@/types/types";

import { EllipsisIcon, MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { Dialog } from "@/components/ui/dialog";
import Modal from "@/components/Modal";
import { useToken } from "@/components/providers/token-provider";

import ProductSelector from "./ProductSelector";
import ItemsListHeaderCell from "./ItemsListHeaderCell";

import { useInfiniteProducts } from "@/api/products/useInfiniteProducts";
import { useUpdateOrder } from "@/api/orders/useUpdateOrder";

import { useDialog } from "@/hooks/use-modal";
import { useDebounce } from "@/lib/utils-client";

interface OrderItemsListProps {
  order: Order;
}

const OrderItemsList = ({ order }: OrderItemsListProps) => {
  const queryClient = useQueryClient();
  const {
    dialogOpen: addProductDialogOpen,
    setDialogOpen: addProductSetDialogOpen,
  } = useDialog();

  const {
    dialogOpen: removeItemDialogOpen,
    openDialog: removeItemOpenDialog,
    setDialogOpen: removeItemSetDialogOpen,
  } = useDialog();

  const token = useToken();

  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToRemove, setProductToRemove] = useState<OrderItem | null>(
    null
  );

  const debouncedSearchPhrase = useDebounce(search, 500);

  const { data, isLoading, error } = useInfiniteProducts({
    search: debouncedSearchPhrase,
    token,
  });
  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const { updateOrderMutation } = useUpdateOrder({ token, order, queryClient });

  const totalAmountOfOrder = order?.items.reduce(
    (acc: number, item: OrderItem) => acc + item.price * item.quantity,
    0
  );

  const totalItemsQuantity = order?.items.reduce(
    (acc: number, item: OrderItem) => acc + item.quantity,
    0
  );

  const handleSelectProduct = (id: string) => {
    const product = allProducts.find((p) => p.id === Number(id));

    if (!product) return;

    setSelectedProduct(product);
  };

  const handleRemoveProduct = (item: OrderItem) => {
    removeItemOpenDialog();
    setProductToRemove(item);
  };

  const handleSave = () => {
    if (selectedProduct) {
      const updatedItems = [
        ...order.items,
        {
          price: selectedProduct?.price,
          quantity: 1,
          product: selectedProduct,
          order_id: order.id,
        },
      ];
      updateOrderMutation.mutate(
        { updatedItems },
        {
          onSuccess: () => {
            setSelectedProduct(null);
            addProductSetDialogOpen(false);
          },
        }
      );
      return;
    }

    if (productToRemove) {
      const updatedItems = order.items.filter(
        (i) => i.id !== productToRemove.id
      );

      updateOrderMutation.mutate(
        { updatedItems },
        {
          onSuccess: () => {
            setProductToRemove(null);
            removeItemSetDialogOpen(false);
          },
        }
      );
    }
  };

  return (
    <div className="w-full col-span-2">
      <div className="grid grid-cols-8 mb-4 font-semibold">
        <ItemsListHeaderCell children="Image" />
        <ItemsListHeaderCell
          children="Name"
          styles="text-lg text-zinc-700 dark:text-zinc-300 col-span-3"
        />
        <ItemsListHeaderCell children="Quantity" />
        <ItemsListHeaderCell children="Price" />
        <ItemsListHeaderCell children="Price" />

        <EllipsisIcon className="size-6 col-span-1 justify-self-end  text-zinc-700 dark:text-zinc-300" />
      </div>
      {order.items.map((item: OrderItem) => (
        <div
          className="grid grid-cols-8 font-semibold items-center overflow-y-auto"
          key={item.id}
        >
          <Image
            src={item.product.images[0].image_link}
            width={40}
            height={40}
            alt={item.product.name}
            className="w-20 aspect-square col-span-1 mb-2"
          />
          <p className="text-md text-neutral-400 col-span-3">
            {item.product.name}
          </p>
          <p className="text-md text-neutral-400 col-span-1">{item.quantity}</p>
          <p className="text-md text-neutral-400 col-span-1">
            ${item.price.toLocaleString()}
          </p>
          <p className="text-md text-neutral-400 col-span-1">
            ${(item.quantity * item.price).toLocaleString()}
          </p>
          {order.items.length > 1 && (
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
      ))}
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
        <Button
          size="icon"
          className="col-span-1 justify-self-end"
          onClick={() => addProductSetDialogOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <Dialog
        open={addProductDialogOpen}
        onOpenChange={addProductSetDialogOpen}
      >
        <ProductSelector
          search={search}
          setSearch={setSearch}
          selectedProduct={selectedProduct}
          handleSelectProduct={handleSelectProduct}
          isLoading={isLoading}
          error={error}
          allProducts={allProducts}
          isPending={updateOrderMutation.isPending}
          handleSave={handleSave}
        />
      </Dialog>
      <Dialog
        open={removeItemDialogOpen}
        onOpenChange={removeItemSetDialogOpen}
      >
        <Modal
          title="Remove product item"
          descriptionFirst={`Do you want to remove ${productToRemove?.product.name} from order ${order.id}`}
          descriptionSecond="This action can't be undone"
          destructive
          action={handleSave}
          buttonActionTitle="Delete"
          buttonActionTitleContinuous="Deleting"
          isPending={updateOrderMutation.isPending}
        />
      </Dialog>
    </div>
  );
};

export default OrderItemsList;
