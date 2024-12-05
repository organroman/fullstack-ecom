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
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="text-right">
          <ProductActionsMenu product={product} />
        </div>
      );
    },
  },
];
