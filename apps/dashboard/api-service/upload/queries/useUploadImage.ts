import { useMutation } from "@tanstack/react-query";
import { uploadImage, UploadResponse, UploadVariables } from "..";

export function useUploadImage() {
  const mutation = useMutation<UploadResponse, Error, any>({
    mutationFn: ({ file, category }: UploadVariables) =>
      uploadImage({ file, category }),
    onSuccess: (data) => {
      return data;
    },
  });
  return { uploadMutation: mutation };
}
