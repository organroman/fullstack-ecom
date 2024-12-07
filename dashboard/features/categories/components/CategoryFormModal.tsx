import { Category, CategoryFormModalData, Status } from "@/types/types";

import { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import Modal from "@/components/Modal";
import UseFormInput from "@/components/form/UseFormInput";
import UseFormSelect from "@/components/form/UseFormSelect";

import { CATEGORY_STATUSES } from "@/lib/constants";
import { categorySchema } from "@/lib/schema";
import UseFormUploader from "@/components/form/UseFormFileUploader";
interface CategoryFormModalProps {
  category?: Category;
  categoryMutation: UseMutationResult<
    void,
    Error,
    CategoryFormModalData,
    unknown
  >;
}

const CategoryFormModal = ({
  category,
  categoryMutation,
}: CategoryFormModalProps) => {
  const form = useForm<CategoryFormModalData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category ? category.name : "",
      slug: category ? category.slug : "",
      description: category ? category.description : "",
      icon_url: category ? category.icon_url : "",
      status: category ? category.status : Status.ACTIVE,
      display_order: category ? String(category.display_order) : "",
    },
  });

  const statuses = CATEGORY_STATUSES.filter((status) => status !== "All");
  const onSubmit = (formData: CategoryFormModalData) => {
    categoryMutation.mutate(formData, { onSuccess: () => form.reset() });
  };
  return (
    <Modal
      title={category ? "Edit category" : "Create category"}
      descriptionFirst={
        category
          ? "Update the fields and click 'Save'"
          : "fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="category-form"
      isPending={categoryMutation.isPending}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          id="category-form"
        >
          <UseFormInput
            name="name"
            control={form.control}
            label="Name"
            placeholder="Laptops"
          />
          <UseFormInput
            name="slug"
            control={form.control}
            label="Slug"
            placeholder="laptops"
          />
          <UseFormInput
            name="description"
            control={form.control}
            label="Description"
            fieldType="textarea"
            rows={2}
            placeholder="Enter some category description"
          />
          <UseFormSelect
            name="status"
            control={form.control}
            label="Status"
            placeholder="Select a status"
            selectItems={statuses}
          />
          <UseFormInput
            name="display_order"
            control={form.control}
            label="Display order"
            placeholder="Enter the number of position in list of categories"
          />
          <UseFormUploader
            name="icon_url"
            control={form.control}
            label="Icon"
          />
        </form>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
