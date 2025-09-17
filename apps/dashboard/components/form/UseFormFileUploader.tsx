"use client";

import {FieldValues, Path, Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useUploadImage } from "@/api/upload/queries/useUploadImage";
import { ImageIcon, ImageUpIcon, Loader, TrashIcon } from "lucide-react";

type UseFormUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  folderName?: string;
};

const UseFormUploader = <T extends FieldValues>({
  name,
  label,
  control,
  folderName = "general",
}: UseFormUploaderProps<T>) => {
  const { uploadMutation } = useUploadImage();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (url: string) => void
  ) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    uploadMutation.mutate(
      { file, category: folderName },
      {
        onSuccess: (data) => {
          onChange(data.fileUrl);
        },
      }
    );
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="flex flex-col gap-3">
                {!value || value === "" ? (
                  <div className="w-16 h-16 flex flex-col items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <ImageIcon className="size-5" />
                    <p className="text-xs">No image</p>
                  </div>
                ) : (
                  <div className="relative w-16 h-16">
                    <img
                      src={value}
                      alt={`Preview icon`}
                      className="w-12 h-12 object-contain rounded-md"
                    />
                    <button
                      className="absolute top-0 right-0 bg-zinc-600 bg-opacity-50 dark:text-zinc-300 text-white rounded-full hover:bg-opacity-70 p-1.5"
                      onClick={() => onChange("")}
                    >
                      <TrashIcon className="size-3" />
                    </button>
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-zinc-300 dark:text-zinc-300 dark:bg-zinc-700 bg-opacity-40 dark:bg-opacity-50 rounded cursor-pointer dark:hover:bg-opacity-40 hover:bg-opacity-30 transition-opacity">
                    {uploadMutation.isPending ? (
                      <>
                        <Loader className="text-blue-500 size-5 mr-2 animate-spin" />
                        <p className="text-zinc-700 dark:text-zinc-300 text-md">
                          Please wait
                        </p>
                      </>
                    ) : (
                      <>
                        <ImageUpIcon className="size-5 text-blue-500 mr-2" />
                        <p className="text-zinc-700 dark:text-zinc-300 text-md">
                          Select icon
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, onChange)}
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default UseFormUploader;
