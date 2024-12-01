import { ProductType } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import ActionsMenu from "./ActionsMenu";

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
      

      return <ActionsMenu product={product} />;
    },
  },
];
