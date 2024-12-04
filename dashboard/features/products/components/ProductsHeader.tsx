"use client";

import { ProductFormModalData } from "@/types/types";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ChevronLeftIcon, LayoutGridIcon, TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ProductFormModal from "./ProductFormModal";

import { handleCreateProduct } from "../actions";
import Search from "@/components/Search";

interface ProductsHeaderProps {
  view?: string;
  handleView?: () => void;
  searchPhrase?: string;
  setSearchPhrase?: Dispatch<SetStateAction<string>>;
  title: string;
}

const ProductsHeader = ({
  view,
  handleView,
  searchPhrase,
  setSearchPhrase,
  title,
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

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-row items-center justify-between pt-4">
      <div className="flex items-center gap-4">
        <Button onClick={goBack} className="text-md [&_svg]:size-5">
          <ChevronLeftIcon />
          Back
        </Button>
        <h2 className="text-3xl">{title}</h2>
      </div>
      <div className="flex items-center justify-end gap-4">
        {setSearchPhrase && (
          <Search
            searchPhrase={searchPhrase || ""}
            handleSearch={updateQueryParams}
            onChange={setSearchPhrase}
          />
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Product</Button>
          </DialogTrigger>
          <ProductFormModal productMutation={createProductMutation} />
        </Dialog>
        {view && (
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
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;
