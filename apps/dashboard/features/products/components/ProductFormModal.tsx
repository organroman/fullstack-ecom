"use client";

import { Category, ProductFormModalData, Product } from "@/types/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import { Form } from "@/components/ui/form";

import Modal from "@/components/Modal";
import UseFormInput from "@/components/form/UseFormInput";
import UseFormSelect from "@/components/form/UseFormSelect";
import { useSearchParams } from "next/navigation";
import { SelectContent, SelectItem } from "@/components/ui/select";

import UseFormFilesArrayUploader from "@/components/form/UseFormFilesArrayUploader";
import { createProductSchema } from "@/lib/schema";
import { useGetCategories } from "@/api-service/categories/useGetCategories";

interface ProductFormModalProps {
  productMutation: UseMutationResult<
    Product,
    Error,
    ProductFormModalData,
    unknown
  >;
  product?: Product;
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
      images: product ? product.images : [],
      price: product ? String(product.price) : "",
      category_id: product ? String(product?.category_id) : "",
    },
  });

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useGetCategories({ search, token: null });
  const { categories = [] } = data || {};

  const onSubmit = (formData: ProductFormModalData) => {
    productMutation.mutate(
      {
        id: Number(product?.id),
        category_id: formData.category_id.toString(),
        name: formData.name,
        description: formData.description,
        price: formData.price,
        images: form.control._formValues.images,
      },
      {
        onSuccess: () => {
          form.control._reset();
        },
      }
    );
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
          className="space-y-2 max-w-md"
          id="create-product"
        >
          <UseFormInput
            name="name"
            control={form.control}
            label="Name"
            placeholder="Enter product name"
          />
          <UseFormSelect
            name="category_id"
            control={form.control}
            label="Select category"
            selectContent={
              <SelectContent>
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  categories?.map((category: Category) => (
                    <SelectItem
                      key={category.slug}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            }
          />
          <UseFormInput
            name="description"
            control={form.control}
            label="Description"
            placeholder="Enter product description"
            fieldType="textarea"
            rows={3}
          />
          <UseFormInput
            name="price"
            control={form.control}
            label="Price"
            placeholder="Enter product price "
          />
          <UseFormFilesArrayUploader
            name="images"
            control={form.control}
            label="Images"
            product={product}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
