"use client";

import { Category, ProductFormModalData, ProductType } from "@/types/types";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";

import { Form } from "@/components/ui/form";

import { createProductSchema } from "@/lib/schema";
import Modal from "@/components/Modal";
import UseFormInput from "@/components/form/UseFormInput";
import UseFormSelect from "@/components/form/UseFormSelect";
import { useGetCategories } from "@/api/categories/queries/useGetCategories";
import { useSearchParams } from "next/navigation";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Loader, MinusIcon, PlusIcon } from "lucide-react";
import UseFormUploader from "@/components/form/UseFormFileUploader";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      images: product ? product.images : [{ image_link: "" }],
      price: product ? String(product.price) : "",
      category_id: product ? String(product?.category_id) : "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useGetCategories(search);
  const { categories = [] } = data || {};

  const handleAppendUploader = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    append({
      image_link: "",
    });
  };

  const handleRemoveUploader = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    remove(index);
  };

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
        onSuccess: () => form.control._reset(),
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
          className="space-y-2"
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

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-end space-x-2">
              <UseFormUploader
                key={field.id}
                control={form.control}
                label="Images"
                {...form.register(`images.${index}.image_link` as const)}
                uploadedUrl={
                  fields[index].image_link ||
                  form.control._formValues.images[index].image_link
                }
                arrayActions={
                  <div className="flex flex-row items-center space-x-2">
                    {fields.length - 1 === index && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={(e) => handleAppendUploader(e)}
                              className="w-9 h-9 bg-emerald-500 hover:bg-emerald-700"
                              size="icon"
                            >
                              <PlusIcon className="w-9 h-9" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add one more image uploader field</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {index > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="w-9 h-9"
                              onClick={(e) => handleRemoveUploader(e, index)}
                            >
                              <MinusIcon className="p-0" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove image uploader field</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                }
              />
            </div>
          ))}
        </form>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
