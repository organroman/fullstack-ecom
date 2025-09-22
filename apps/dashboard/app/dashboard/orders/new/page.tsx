"use client";
import { EOrderStatus, OrderItem, Product, User } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, PlusIcon, SaveIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useInfiniteProducts } from "@/api-service/products/useInfiniteProducts";
import { useCreateUser } from "@/api-service/users/useCreateUser";
import { usePaginatedUsers } from "@/api-service/users/useGetPaginatedUsers";
import { useCreateOrder } from "@/api-service/orders/useCreateOrder";

import Header from "@/components/Header";

import { useToken } from "@/components/providers/token-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import OrderDetail from "@/features/orders/components/OrderDetail";
import OrderItemsListHeader from "@/features/orders/components/OrderItemsListHeader";
import OrderListItem from "@/features/orders/components/OrderListItem";
import OrderListItemsFooter from "@/features/orders/components/OrderListItemsFooter";
import ProductSelector from "@/features/orders/components/ProductSelector";
import StatusChangeSelector from "@/features/orders/components/StatusChangeSelector";
import UsersFormModal from "@/features/users/components/UsersFormModal";

import { useDialog } from "@/hooks/use-modal";
import { useDebounce } from "@/lib/utils-client";


type Item = {
  product: Product;
  quantity: number;
};

const NewOrderPage = () => {
  const [status, setStatus] = useState<EOrderStatus>(EOrderStatus.NEW);
  const [customer, setCustomer] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const token = useToken();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const {
    dialogOpen: addProductDialogOpen,
    setDialogOpen: addProductSetDialogOpen,
  } = useDialog();

  const {
    dialogOpen: createUserDialogOpen,
    closeDialog: createUserCloseDialog,
    setDialogOpen: createUserSetDialogOpen,
  } = useDialog();

  const debouncedSearchPhrase = useDebounce(search, 500);

  const { data, isLoading, error } = useInfiniteProducts({
    search: debouncedSearchPhrase,
    token,
  });
  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  const {
    data: customersData,
    isLoading: customersIsLoading,
    error: customersError,
  } = usePaginatedUsers({
    page: 1,
    limit: 10,
    search: debouncedSearchPhrase,
    role: "",
    token,
  });

  const { createUserMutation } = useCreateUser({
    closeDialog: createUserCloseDialog,
    queryClient,
    token,
    handleOnSuccess(data) {
      setCustomer(data);
    },
  });

  const { createOrderMutation } = useCreateOrder({
    queryClient,
    token,
    handleSuccess(data) {
      router.push(`/dashboard/orders/${data.id}`);
    },
  });

  const totalAmountOfOrder = items.reduce(
    (acc: number, item: Item) => acc + item.product.price * item.quantity,
    0
  );

  const totalItemsQuantity = items.reduce(
    (acc: number, item: Item) => acc + item.quantity,
    0
  );

  const handleStatusChange = (status: EOrderStatus) => {
    setStatus(status);
  };

  const handleSelectProduct = (id: string) => {
    const product = allProducts.find((p) => p.id === Number(id));

    if (!product) return;

    setSelectedProduct(product);
  };

  const handleSaveSelectedProduct = () => {
    const isAlreadySelected = items.some(
      (i) => i.product.id === selectedProduct?.id
    );

    if (isAlreadySelected) {
      addProductSetDialogOpen(false);
      setSelectedProduct(null);
      return;
    }

    if (selectedProduct) {
      setItems([...items, { quantity: 1, product: selectedProduct }]);
      addProductSetDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleRemoveProduct = (item: Item) => {
    const updatedItems = items.filter((i) => i.product.id !== item.product.id);
    setItems(updatedItems);
  };

  const handleQuantity = (id: number, action: "plus" | "minus") => {
    const itemForUpdate = items.find((i) => i.product.id === id);

    if (!itemForUpdate) return;

    const updatedItems = items.map((i) =>
      i.product.id === id
        ? {
            ...i,
            quantity: action === "plus" ? i.quantity + 1 : i.quantity - 1,
          }
        : i
    );

    setItems(updatedItems);
  };

  const handleSelectCustomer = (id: string) => {
    if (!customersData) return;
    const client = customersData?.users.find(
      (c) => Number(c.id) === Number(id)
    );

    if (client) setCustomer(client);
  };

  const handleSaveOrder = () => {
    if (!customer || items.length === 0) return;

    createOrderMutation.mutate({
      user: customer,
      items: items as OrderItem[],
      status: status,
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Header title="New order" backBtn />
      <Card className="flex-grow pt-4">
        <CardContent className="grid grid-cols-3 gap-4 flex-grow">
          <div className="col-span-1 items-start flex flex-col gap-2 font-semibold border-r border-zinc-700">
            <div className="flex flex-row items-center justify-between pr-4">
              <OrderDetail
                title="Status:"
                value={
                  <div className="col-span-4 ">
                    <StatusChangeSelector
                      defaultValue={status}
                      disabled={false}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                }
              />
              <Button
                disabled={!customer || items.length === 0}
                className="font-bold text-lg"
                onClick={handleSaveOrder}
              >
                {createOrderMutation.isPending ? (
                  <div className="flex flex-row items-center gap-1">
                    <Loader className="animate-spin" /> Saving
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-1">
                    <SaveIcon /> Save order
                  </div>
                )}
              </Button>
            </div>

            <h3 className="text-xl mt-4">Customer</h3>
            <div className="w-full flex flex-row items-center justify-between pr-4">
              <Select
                value={customer?.id?.toString()}
                onValueChange={(id: string) => handleSelectCustomer(id)}
              >
                <SelectTrigger className="w-[280px]">
                  {customer ? customer.name : "Select customer"}
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-80 w-full max-w-full">
                  <div className="z-10 p-4">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                      placeholder="Search customer"
                      className="bg-zinc-700"
                    />
                  </div>
                  {customersIsLoading && (
                    <Loader className="size-6 animate-spin text-blue-500 mt-2 mx-auto" />
                  )}
                  {customersError && (
                    <p className="text-red-500 font-semibold">
                      {customersError.message}
                    </p>
                  )}
                  {customersData?.users.length === 0 && (
                    <p className="mb-4 text-center">Customer not found</p>
                  )}
                  {customersData?.users.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id?.toString() || "id"}
                      className="truncate w-full max-w-sm"
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => createUserSetDialogOpen(true)}
                variant="outline"
              >
                <PlusIcon /> New customer
              </Button>
            </div>
            {customer && (
              <>
                <OrderDetail title="Name:" value={customer.name} />
                <OrderDetail title="Phone:" value={customer.phone} />
                <OrderDetail title="Email:" value={customer.email} />
                <OrderDetail title="Address:" value={customer.address} />
              </>
            )}
          </div>
          <div className="w-full col-span-2">
            <div className="w-full flex flex-row justify-between mb-4">
              <p className="text-2xl font-bold">Products</p>
              <Button
                className="col-span-1 justify-self-end"
                onClick={() => addProductSetDialogOpen(true)}
                variant="outline"
              >
                <PlusIcon /> Add product
              </Button>
            </div>
            {items.length !== 0 && (
              <>
                <OrderItemsListHeader />

                {items.map((item) => (
                  <OrderListItem
                    key={item.product.id}
                    item={{ ...item, price: item.product.price }}
                    isRemoveBtnShown={true}
                    handleRemoveProduct={handleRemoveProduct}
                    handleQuantity={handleQuantity}
                  />
                ))}
                <OrderListItemsFooter
                  totalAmountOfOrder={totalAmountOfOrder}
                  totalItemsQuantity={totalItemsQuantity}
                />
              </>
            )}
            <Dialog
              open={addProductDialogOpen}
              onOpenChange={addProductSetDialogOpen}
            >
              <ProductSelector
                selectedProduct={selectedProduct}
                handleSelectProduct={handleSelectProduct}
                search={search}
                setSearch={setSearch}
                isLoading={isLoading}
                error={error}
                allProducts={allProducts}
                handleSave={handleSaveSelectedProduct}
              />
            </Dialog>
            <Dialog
              open={createUserDialogOpen}
              onOpenChange={createUserSetDialogOpen}
            >
              <UsersFormModal userMutation={createUserMutation} />
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOrderPage;
