"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import Search from "@/components/Search";
import UsersFormModal from "./UsersFormModal";

import UserRolesSelector from "@/components/UserRolesSelector";
import { ChevronLeftIcon } from "lucide-react";

interface UsersHeaderProps {
  title: string;
  searchPhrase?: string;
  setSearchPhrase?: Dispatch<SetStateAction<string>>;
}

const UsersHeader = ({
  title,
  searchPhrase,
  setSearchPhrase,
}: UsersHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "";

  // const [open, setOpen] = useState<boolean>(false);

  const updateQueryParams = (newSearch: string, newRole?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    newSearch
      ? params.set("search", newSearch?.toString())
      : params.delete("search");

    newRole &&
      (newRole === "All"
        ? params.delete("role")
        : params.set("role", newRole.toString()));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (role: string) => {
    updateQueryParams(searchPhrase || "", role);
  };

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
          <>
            <Search
              searchPhrase={searchPhrase || ""}
              handleSearch={updateQueryParams}
              onChange={setSearchPhrase}
            />

            <UserRolesSelector
              role={role}
              onChange={handleFilterChange}
              isDisplaySelectItemAll
            />
          </>
        )}
        <Dialog
        // open={open} onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button>Create User</Button>
          </DialogTrigger>
          <UsersFormModal />
        </Dialog>
      </div>
    </div>
  );
};

export default UsersHeader;
