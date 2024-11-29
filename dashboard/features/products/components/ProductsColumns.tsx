
import { ProductType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import DeleteProductModal from "./DeleteProductModal";
import ActionsMenu from "./ActionsMenu";

export const productColumns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: "Id",
    // cell: ({ row }) => {
    //   const id = row.getValue("id") as number;
    //   return <Link href={`/dashboard/products/${id}`}>{id}</Link>;
    // },
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return <ActionsMenu product={product} />;
    },
  },
];
