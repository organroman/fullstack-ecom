import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Category } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import CategoryActionMenu from "./CategoryActionsMenu";

export const categoriesColumns: ColumnDef<Category>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "icon_url",
    header: "Icon",
    cell: ({ row }) => {
      const icon = row.getValue<string>("icon_url");
      return (
        <Avatar className="size-8">
          <AvatarImage src={icon} />
        </Avatar>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "display_order",
    header: "Order",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="text-right">
          <CategoryActionMenu category={category} />
        </div>
      );
    },
  },
];
