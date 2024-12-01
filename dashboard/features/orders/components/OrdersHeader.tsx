"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/components/Search";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductsHeaderProps {
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
}

const OrdersHeader = ({
  searchPhrase,
  setSearchPhrase,
}: ProductsHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const updateQueryParams = (newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex items-center justify-end gap-4">
      <Search
        searchPhrase={searchPhrase}
        handleSearch={updateQueryParams}
        onChange={setSearchPhrase}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Order</Button>
        </DialogTrigger>
        {/* <CreateProductForm productMutation={createProductMutation} /> */}
      </Dialog>
    </div>
  );
};

export default OrdersHeader;
