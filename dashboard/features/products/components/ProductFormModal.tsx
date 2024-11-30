"use client";

import { ProductFormModalData, ProductType } from "@/types/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createProductSchema } from "@/lib/schema";

interface ProductFormModalProps {
  productMutation: UseMutationResult<
    void,
    Error,
    ProductFormModalData,
    unknown
  >;
  product?: ProductType;
}

const ProductFormModal = ({
  productMutation,
  product,
}: ProductFormModalProps) => {
  const form = useForm<ProductFormModalData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product ? product.name : "",
      description: product ? product.description : "",
      image: product ? product.image : "",
      price: product ? String(product.price) : "",
    },
  });

  const onSubmit = (formData: ProductFormModalData) => {
    console.log("submitting form data", formData);
    productMutation.mutate(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{product ? "Edit" : "Create"} product</DialogTitle>
        <DialogDescription>
          Please {product ? "update" : "fill in"} the fields and click "Save".
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          id="create-product"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="name"
                    placeholder="Enter product name"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="description"
                    placeholder="Enter product description"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="Image"
                    placeholder="Paste product image URL"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="Price"
                    placeholder="Enter product price "
                    type="text"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <DialogFooter className="sm:justify-start w-full">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={productMutation.isPending}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          form="create-product"
          className="w-full"
          disabled={productMutation.isPending}
        >
          {productMutation.isPending ? (
            <div className="flex flex-row">
              <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
              <span>Saving</span>
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProductFormModal;
