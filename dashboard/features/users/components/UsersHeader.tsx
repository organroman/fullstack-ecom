import React, { Dispatch, SetStateAction, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import Search from "@/components/Search";
import UsersFormModal from "./UsersFormModal";


import UserRolesSelector from "@/components/UserRolesSelector";

interface UsersHeaderProps {
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
}

const UsersHeader = ({ searchPhrase, setSearchPhrase }: UsersHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "";

  const [open, setOpen] = useState<boolean>(false);

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
    updateQueryParams(searchPhrase, role);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Search
        searchPhrase={searchPhrase}
        handleSearch={updateQueryParams}
        onChange={setSearchPhrase}
      />
      <UserRolesSelector
        role={role}
        onChange={handleFilterChange}
        isDisplaySelectItemAll
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create User</Button>
        </DialogTrigger>
        <UsersFormModal />
      </Dialog>
    </div>
  );
};

export default UsersHeader;
