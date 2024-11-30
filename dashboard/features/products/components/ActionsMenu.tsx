import { ProductFormModalData, ProductType } from "@/types/types";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLinkIcon,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import DeleteProductModal from "./DeleteProductModal";
import CreateProductForm from "./ProductFormModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { handleUpdateProduct } from "../actions";

const ActionsMenu = ({ product }: { product: ProductType }) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const view = searchParams.get("view");

  const editProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: ProductFormModalData) => {
      const data = await handleUpdateProduct(
        product.id,
        name,
        description,
        image,
        price
      );
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/products/${product.id}`}>
              <ExternalLinkIcon /> View product
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <PencilIcon /> Edit Product
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 font-semibold focus:text-red-700 focus:bg-red-200"
          >
            <TrashIcon /> Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteProductModal product={product} onClose={setIsDeleteDialogOpen} />
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CreateProductForm
          product={product}
          productMutation={editProductMutation}
        />
      </Dialog>
    </>
  );
};

export default ActionsMenu;
