"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/components/Search";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { EOrderStatuses } from "@/types/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import OrderFormModal from "./OrderFormModal";

interface OrdersHeaderProps {
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
}

const orderStatuses = [
  "All",
  ...Object.keys(EOrderStatuses).filter((status) => isNaN(Number(status))),
];

const OrdersHeader = ({ searchPhrase, setSearchPhrase }: OrdersHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(status || "All");

  const updateQueryParams = (newSearch: string, newStatus?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    newStatus &&
      (newStatus === "All"
        ? params.delete("status")
        : params.set("status", newStatus.toString()));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
    updateQueryParams(searchPhrase, status);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Search
        searchPhrase={searchPhrase}
        handleSearch={updateQueryParams}
        onChange={setSearchPhrase}
      />
      <Select value={selectedStatus} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          {selectedStatus === "All"
            ? "Select a status"
            : capitalizeFirstLetter(selectedStatus)}
        </SelectTrigger>
        <SelectContent>
          {orderStatuses.map((status) => (
            <SelectItem value={status} key={status}>
              {capitalizeFirstLetter(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Order</Button>
        </DialogTrigger>
        <OrderFormModal />
      </Dialog>
    </div>
  );
};

export default OrdersHeader;
