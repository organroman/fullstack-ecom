import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductType } from "@/types/types";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { MouseEventHandler, useState } from "react";
import DeleteProductModal from "./DeleteProductModal";
import CreateProductForm from "./CreateProductForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const ActionsMenu = ({ product }: { product: ProductType }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <Dialog
      open={isEditDialogOpen || isDeleteDialogOpen}
      onOpenChange={
        isEditDialogOpen ? setIsEditDialogOpen : setIsDeleteDialogOpen
      }
    >
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
            <Link href={`/dashboard/products/${product.id}`}>View product</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <DialogTrigger className="text-red-500 font-semibold">
              Delete Product
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProductModal product={product} onClose={setIsDeleteDialogOpen} />
    </Dialog>
  );
};

export default ActionsMenu;
