"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  totalPages,
  currentPage,
  currentLimit,
  isLoading,
  onPageChange,
  onLimitChange,
}: DataTableProps<TData, TValue> & {
  currentPage: number;
  currentLimit: number;
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize: currentLimit },
    },
    rowCount: totalItems,
  });

  return (
    <>
      <Table className="flex-grow-0 h-full">
        <TableHeader className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="w-full">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="h-full flex-grow flex-shrink-0">
          {isLoading && (
            <TableRow className="h-full">
              <TableCell
                colSpan={columns.length}
                className="h-full w-full justify-center text-center"
              >
                <Loader className="size-6 animate-spin inline" />
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            (table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-12"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} className="px-4 py-2">
              <div className="flex items-center justify-between w-full">
                <Select
                  value={currentLimit.toString()}
                  onValueChange={(value) => onLimitChange(Number(value))}
                >
                  <SelectGroup className="flex flex-row items-center space-x-2 pl-0">
                    <SelectLabel className="pl-0">Rows per page:</SelectLabel>
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                  </SelectGroup>
                  <SelectContent>
                    {[5, 10, 15, 20].map((size) => (
                      <SelectItem value={size.toString()} key={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
