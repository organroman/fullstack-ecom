import { ProductType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import ProductActionsMenu from "./ProductActionsMenu";

export const productColumns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "id",
    header: "Id",
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
      return <ProductActionsMenu product={product} />;
    },
  },
];
