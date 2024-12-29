import { ColumnDef } from "@tanstack/react-table";
import { EOrderStatus, Order } from "@/types/types";
import dayjs from "dayjs";
import OrderActionsMenu from "./OrderActionsMenu";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_BG_COLOR = {
  NEW: "bg-emerald-600",
  PROCESSING: "bg-sky-400",
  CANCELLED: "bg-red-600",
  SHIPPED: "bg-indigo-400",
  SENT: "bg-purple-400",
};

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;

      const formattedDate = dayjs(date).format("DD.MM.YYYY HH:mm:ss");

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as EOrderStatus;

      return (
        <Badge className={cn("text-white", STATUS_BG_COLOR[status])}>
          {capitalizeFirstLetter(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Customer name",
    cell: ({ row }) => {
      const name = row.original.user.name;
      return <span>{name}</span>;
    },
  },
  { accessorKey: "contact_phone", header: "Contact phone" },
  { accessorKey: "delivery_address", header: "Delivery address" },
  {
    accessorKey: "orderAmount",
    header: "Order amount",
    cell: ({ row }) => {
      const items = row.original.items;

      const orderAmount = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return <span>${orderAmount.toLocaleString()}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="text-right">
          <OrderActionsMenu order={order} />
        </div>
      );
    },
  },
];
