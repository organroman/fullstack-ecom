"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CreateProductFormData } from "@/types/types";
import { createProductSchema } from "@/lib/schema";
import { handleCreateProduct } from "./actions";

const CreateProductForm = () => {
  const router = useRouter();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: CreateProductFormData) => {
      const data = await handleCreateProduct(name, description, image, price);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been created");
      router.push("/dashboard/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (formData: CreateProductFormData) => {
    createProductMutation.mutate(formData);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>Create a new product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
                <FormItem>
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
                <FormItem>
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
            <div className="w-full">
              <Button
                className="w-full mt-6"
                size="lg"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? (
                  <div className="flex flex-row">
                    <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Save product"
                )}
              </Button>
              {createProductMutation.isError && (
                <span className="text-sm text-red-500">
                  {createProductMutation.error.message}
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
