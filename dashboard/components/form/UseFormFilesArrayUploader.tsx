"use client";

import {
  FieldValues,
  Control,
  useFieldArray,
  ArrayPath,
  FieldArray,
} from "react-hook-form";
import { ImageIcon, ImageUpIcon, Loader, TrashIcon } from "lucide-react";
import { useState } from "react";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

import { uploadImage } from "@/api/upload";
import { Product, View } from "@/types/types";
import { useDeleteProductImage } from "@/api/products/useDeleteProductImage";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "../providers/token-provider";

type UseFormFilesArrayUploaderProps<T extends FieldValues> = {
  name: ArrayPath<T>;
  label?: string;
  control: Control<T>;
  folderName?: string;
  product?: Product;
};

const UseFormFilesArrayUploader = <T extends FieldValues>({
  name,
  label,
  control,
  folderName = "general",
  product,
}: UseFormFilesArrayUploaderProps<T>) => {
  const { fields, append, remove } = useFieldArray<T>({
    control,
    name,
  });
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") || "table") as View;
  const queryClient = useQueryClient();
  const token = useToken();

  const { deleteProductImageMutation } = useDeleteProductImage({
    view,
    queryClient,
    token,
  });

  const [isFilesLoading, setIsFilesLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsFilesLoading(true);

    const newFields = await Promise.all(
      Array.from(files).map(
        async (file) =>
          new Promise<{ image_link: string }>((resolve, reject) => {
            uploadImage({ file, category: folderName })
              .then((res) => resolve({ image_link: res.fileUrl }))
              .catch((e) => reject(e));
          })
      )
    );

    setIsFilesLoading(false);

    newFields &&
      newFields.forEach((field) => {
        append(field as FieldArray<T>);
      });
  };

  const handleDelete = async (index: number) => {
    const imageIdToDelete = product?.images[index].id;
    if (!imageIdToDelete) return;

    deleteProductImageMutation.mutate(parseInt(imageIdToDelete));

    remove(index);
  };

  return (
    <FormItem className="max-w-sm">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="max-w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center w-full overflow-x-auto no-scrollbar">
              {fields.length === 0 && (
                <div className="w-20 h-20 flex flex-col items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <ImageIcon className="size-5" />
                  <p className="text-xs">No image</p>
                </div>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative w-20 h-20 flex-shrink-0"
                >
                  <img
                    src={(field as T).image_link}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-contain rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 bg-zinc-600 bg-opacity-50 dark:text-zinc-300 text-white rounded-full hover:bg-opacity-70 p-1.5"
                    onClick={() => handleDelete(index)}
                  >
                    <TrashIcon className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-zinc-300 dark:text-zinc-300 dark:bg-zinc-700 bg-opacity-50 rounded cursor-pointer hover:bg-opacity-30 transition-opacity">
                {isFilesLoading ? (
                  <>
                    <Loader className="text-blue-500 size-6 mr-2 animate-spin" />
                    <p className="text-zinc-700 dark:text-zinc-300 text-md">
                      Please wait
                    </p>
                  </>
                ) : (
                  <>
                    <ImageUpIcon className="size-5 text-blue-500 mr-2" />
                    <p className="text-zinc-700 dark:text-zinc-300 text-md">
                      Select files
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isFilesLoading}
                />
              </label>
            </div>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default UseFormFilesArrayUploader;
