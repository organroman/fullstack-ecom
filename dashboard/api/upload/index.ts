import { API_URL } from "../config";

export interface UploadResponse {
  fileUrl: string;
}

export interface UploadVariables {
  file: File;
  category?: string;
}

export async function uploadImage({
  file,
  category,
}: UploadVariables): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  if (category) formData.append("category", category);

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return data;
  } catch (e) {
    throw e;
  }
}
