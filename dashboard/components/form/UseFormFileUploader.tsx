"use client";

import { ReactNode, useState } from "react";
import { FieldValues, Path, Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useUploadImage } from "@/api/upload/queries/useUploadImage";

type UseFormUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  folderName?: string;
  arrayActions?: ReactNode;
  uploadedUrl?: string;
};

const UseFormUploader = <T extends FieldValues>({
  name,
  label,
  control,
  folderName = "general",
  arrayActions,
  uploadedUrl,
}: UseFormUploaderProps<T>) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { uploadMutation } = useUploadImage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (
    e: React.MouseEvent<HTMLButtonElement>,
    onChange: (url: string) => void
  ) => {
    e.preventDefault();

    if (!file) return;
    uploadMutation.mutate(
      { file, category: folderName },
      {
        onSuccess: (data) => {
          onChange(data.fileUrl);
          setFile(null);
          setPreviewUrl(null);
        },
      }
    );
  };

  const handleCancel = (
    e: React.MouseEvent<HTMLButtonElement>,
    onChange: (url: string) => void
  ) => {
    e.preventDefault();

    if (uploadedUrl) {
      onChange("");
      return;
    }
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="flex flex-row items-end space-x-2">
              {!file && !uploadedUrl && (
                <div className="w-fit">
                  <label className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600">
                    Select File
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {((file && previewUrl) || uploadedUrl) && (
                <div className="space-x-2 flex flex-row items-end">
                  <img
                    src={previewUrl || uploadedUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex space-x-2">
                    {file && previewUrl && (
                      <Button
                        disabled={uploadMutation.isPending}
                        onClick={(e) => handleUpload(e, onChange)}
                      >
                        {uploadMutation.isPending ? "Uploading..." : "Accept?"}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={(e) => handleCancel(e, onChange)}
                    >
                      {uploadedUrl ? "Change icon" : "Cancel"}
                    </Button>
                  </div>
                </div>
              )}
              {arrayActions}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UseFormUploader;
