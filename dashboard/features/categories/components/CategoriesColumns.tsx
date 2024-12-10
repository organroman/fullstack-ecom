import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Category } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import CategoryActionMenu from "./CategoryActionsMenu";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

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
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge
          className={cn(
            "text-primary font-normal",
            status === "ACTIVE"
              ? "bg-emerald-500 hover:bg-emerald-500"
              : "bg-rose-500 hover:bg-rose-500"
          )}
        >
          {capitalizeFirstLetter(status)}
        </Badge>
      );
    },
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
