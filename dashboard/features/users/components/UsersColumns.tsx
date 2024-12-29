"use client";

import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { User, Roles } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import UserActionsMenu from "./UserActionsMenu";
import { Badge } from "@/components/ui/badge";

const rolesColor = {
  ADMIN: "bg-yellow-600 hover:bg-yellow-600",
  "SALES MANAGER": "bg-blue-400 hover:bg-blue-400 ",
  CUSTOMER: "bg-zinc-700",
};

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Roles;

      return (
        <Badge className={cn("text-primary", rolesColor[role])}>
          {capitalizeFirstLetter(role)}
        </Badge>
      );
    },
  },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "phone", header: "Phone" },

  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right">
          <UserActionsMenu user={user} />
        </div>
      );
    },
  },
];
