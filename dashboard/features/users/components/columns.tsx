"use client";

import { IUser, Roles } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type User = {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
};

const rolesColor = {
  ADMIN: "text-blue-600",
  "SALES MANAGER": "text-green-700",
  CUSTOMER: "text-gray-700",
};

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <Link href={`/dashboard/users/${id}`}>{id}</Link>;
    },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Roles;

      return <span className={rolesColor[role]}>{role}</span>;
    },
  },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "phone", header: "Phone" },
];
