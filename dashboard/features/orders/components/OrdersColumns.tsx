import { ColumnDef } from "@tanstack/react-table";
import { IOrder } from "@/types/types";
import dayjs from "dayjs";
import OrderActionsMenu from "./OrderActionsMenu";

export const ordersColumns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;

      const formattedDate = dayjs(date).format("DD.MM.YYYY HH:mm:ss");

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const order = row.original;

      return <OrderActionsMenu order={order} />;
    },
  },
];
