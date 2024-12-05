import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from ".";
import { ProductFormModalData, View } from "@/types/types";
import { toast } from "sonner";

interface UseProductProps {
  view: View;
  closeDialog: () => void;
  queryClient: QueryClient;
}

interface UseProductWithIdProps extends UseProductProps {
  id: number;
}

export function usePaginatedProducts(
  page: number,
  limit: number,
  search: string
) {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => await fetchProducts(page, limit, search),
  });
}

export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ["products-infinite"],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// --------------------

export function useProductById(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => await fetchProductById(id),
  });
}

// --------------------

export function useCreateProduct({
  view,
  closeDialog,
  queryClient,
}: UseProductProps) {
  const mutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: ProductFormModalData) => {
      const data = await createProduct(name, description, image, price);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been created");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: view === "table" ? ["products"] : ["products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { createProductMutation: mutation };
}

//-----

export function useEditProduct({
  id,
  closeDialog,
  queryClient,
  view,
}: UseProductWithIdProps) {
  const editProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: ProductFormModalData) => {
      const data = await updateProduct(id, name, description, image, price);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editProductMutation };
}

// -------------------------------

export function useDeleteProduct({
  closeDialog,
  queryClient,
  view,
}: UseProductProps) {
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await deleteProduct(id);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deleteProductMutation };
}
