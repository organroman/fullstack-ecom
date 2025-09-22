"use client";

import { Order, OrderItem, Product } from "@/types/types";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Dialog } from "@/components/ui/dialog";
import Modal from "@/components/Modal";

import ProductSelector from "./ProductSelector";

import { useInfiniteProducts } from "@/api-service/products/useInfiniteProducts";
import { useUpdateOrder } from "@/api-service/orders/useUpdateOrder";

import { useDialog } from "@/hooks/use-modal";
import { useDebounce } from "@/lib/utils-client";
import OrderItemsListHeader from "./OrderItemsListHeader";
import OrderListItem from "./OrderListItem";
import OrderListItemsFooter from "./OrderListItemsFooter";

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

  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToRemove, setProductToRemove] = useState<OrderItem | null>(
    null
  );

  const debouncedSearchPhrase = useDebounce(search, 500);

  const { data, isLoading, error } = useInfiniteProducts({
    search: debouncedSearchPhrase,
  });
  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const { updateOrderMutation } = useUpdateOrder({ order, queryClient });

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

  const handleQuantity = (id: number, action: "plus" | "minus") => {
    const itemForUpdate = order.items.find((i) => i.product.id === id);

    if (!itemForUpdate) return;

    const updatedItems = order.items.map((i) =>
      i.product.id === id
        ? {
            ...i,
            quantity: action === "plus" ? i.quantity + 1 : i.quantity - 1,
          }
        : i
    );

    updateOrderMutation.mutate({
      updatedItems,
    });
  };

  return (
    <div className="w-full col-span-2">
      <OrderItemsListHeader />
      {order.items.map((item: OrderItem) => (
        <OrderListItem
          key={item.id}
          item={item}
          handleRemoveProduct={handleRemoveProduct}
          isRemoveBtnShown={order.items.length > 1}
          handleQuantity={handleQuantity}
        />
      ))}
      <OrderListItemsFooter
        totalAmountOfOrder={totalAmountOfOrder}
        totalItemsQuantity={totalItemsQuantity}
        addProductSetDialogOpen={() => addProductSetDialogOpen(true)}
      />

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
