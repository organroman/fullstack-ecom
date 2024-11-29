"use client";

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

import { CreateProductFormData } from "@/types/types";
import { createProductSchema } from "@/lib/schema";

interface CreateProductFormProps {
  createProductMutation: UseMutationResult<
    void,
    Error,
    CreateProductFormData,
    unknown
  >;
}

const CreateProductForm = ({
  createProductMutation,
}: CreateProductFormProps) => {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: "",
    },
  });

  const onSubmit = (formData: CreateProductFormData) => {
    createProductMutation.mutate(formData);
  };

  return (
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
  );
};

export default CreateProductForm;
