"use client";

import { CreateProductFormData } from "@/types/types";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { LayoutGridIcon, Loader, SearchIcon, TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CreateProductForm from "./CreateProductForm";

import { handleCreateProduct } from "../actions";

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

  const createProductMutation = useMutation<void, Error, CreateProductFormData>(
    {
      mutationFn: async ({
        name,
        description,
        price,
        image,
      }: CreateProductFormData) => {
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
    }
  );

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="relative h-10">
        <Input
          type="text"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
          placeholder="Type for search"
          className="w-[320px] border border-input rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-600"
        />
        <Button
          variant="link"
          onClick={() => updateQueryParams(searchPhrase)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
        >
          <SearchIcon />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Product</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>
              Please fill in the fields and click "Save".
            </DialogDescription>
          </DialogHeader>
          <CreateProductForm createProductMutation={createProductMutation} />

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
        </DialogContent>
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
