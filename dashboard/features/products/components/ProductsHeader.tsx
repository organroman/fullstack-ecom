"use client";

import { ProductFormModalData } from "@/types/types";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { LayoutGridIcon, SearchIcon, TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CreateProductForm from "./ProductFormModal";

import { handleCreateProduct } from "../actions";
import Search from "@/components/Search";

interface ProductsHeaderProps {
  view: string;
  handleView: () => void;
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
}

const ProductsHeader = ({
  view,
  handleView,
  searchPhrase,
  setSearchPhrase,
}: ProductsHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const updateQueryParams = (newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const createProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      image,
    }: ProductFormModalData) => {
      const data = await handleCreateProduct(name, description, image, price);
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been created");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: view === "table" ? ["products"] : ["products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex items-center justify-end gap-4">
      <Search
        searchPhrase={searchPhrase}
        handleSearch={updateQueryParams}
        onChange={setSearchPhrase}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Product</Button>
        </DialogTrigger>
        <CreateProductForm productMutation={createProductMutation} />
        {/* <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>
              Please fill in the fields and click "Save".
            </DialogDescription>
          </DialogHeader>
          <CreateProductForm productMutation={createProductMutation} />

          <DialogFooter className="sm:justify-start w-full">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={createProductMutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="create-product"
              className="w-full"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? (
                <div className="flex flex-row">
                  <Loader className="size-6 animate-spin text-muted-foreground mr-2" />
                  <span>Saving</span>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent> */}
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              onClick={handleView}
              className="[&_svg]:size-6"
            >
              {view === "grid" ? <LayoutGridIcon /> : <TableIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            <p>Switch to {view === "grid" ? "table" : "grid"} view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProductsHeader;
