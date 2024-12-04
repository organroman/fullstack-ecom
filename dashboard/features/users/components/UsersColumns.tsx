"use client";

import { capitalizeFirstLetter } from "@/lib/utils";
import { IUser, Roles } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import UserActionsMenu from "./UserActionsMenu";

export type User = {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
};

const rolesColor = {
  ADMIN: "text-blue-600",
  "SALES MANAGER": "text-green-700",
  CUSTOMER: "text-yellow-500",
};

export const usersColumns: ColumnDef<IUser>[] = [
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
        <span className={rolesColor[role]}>{capitalizeFirstLetter(role)}</span>
      );
    },
  },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionsMenu user={user} />;
    },
  },
];
