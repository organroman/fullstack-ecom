import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Roles } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";

import React, { Dispatch, SetStateAction, useState } from "react";
import UsersFormModal from "./UsersFormModal";

interface UsersHeaderProps {
  searchPhrase: string;
  setSearchPhrase: Dispatch<SetStateAction<string>>;
}

const userRoles = [
  "All",
  ...Object.values(Roles).filter((role) => isNaN(Number(role))),
];

const UsersHeader = ({ searchPhrase, setSearchPhrase }: UsersHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const [open, setOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>(role || "All");

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
    setSelectedRole(role);
    updateQueryParams(searchPhrase, role);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Search
        searchPhrase={searchPhrase}
        handleSearch={updateQueryParams}
        onChange={setSearchPhrase}
      />
      <Select value={selectedRole} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          {selectedRole === "All"
            ? "Select a role"
            : capitalizeFirstLetter(selectedRole)}
        </SelectTrigger>

        <SelectContent>
          {userRoles.map((role) => (
            <SelectItem value={role} key={role}>
              {capitalizeFirstLetter(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
