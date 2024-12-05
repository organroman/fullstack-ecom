"use client";

import { ProductFormModalData, ProductType } from "@/types/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createProductSchema } from "@/lib/schema";
import { Textarea } from "@/components/ui/textarea";
import Modal from "@/components/Modal";

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
    productMutation.mutate(formData);
  };

  return (
    <Modal
      title={product ? "Edit product" : "Create product"}
      descriptionFirst={
        product
          ? "Update the fields and click 'Save'"
          : "fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="create-product"
      isPending={productMutation.isPending}
    >
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
                  <Textarea
                    {...field}
                    rows={10}
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
    </Modal>
  );
};

export default ProductFormModal;
