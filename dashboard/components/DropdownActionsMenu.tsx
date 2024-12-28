"use client";

import { SetStateAction } from "react";
import Link from "next/link";

import {
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DropdownActionsMenuProps {
  label?: string;
  viewItemLink?: string;
  viewItemTitle?: string;
  editItemDialogOpen: (value: SetStateAction<boolean>) => void;
  editItemTitle: string;
  deleteItemDialogOpen?: (value: SetStateAction<boolean>) => void;
  deleteItemTitle?: string;
}

const DropdownActionsMenu = ({
  label = "Actions",
  viewItemLink,
  viewItemTitle,
  editItemDialogOpen,
  editItemTitle,
  deleteItemDialogOpen,
  deleteItemTitle,
}: DropdownActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {viewItemLink && (
          <DropdownMenuItem asChild>
            <Link href={viewItemLink}>
              <ExternalLinkIcon /> {viewItemTitle}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => editItemDialogOpen(true)}>
          <PencilIcon /> {editItemTitle}
        </DropdownMenuItem>
        {deleteItemTitle && deleteItemDialogOpen && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteItemDialogOpen(true)}
              className="text-red-600 font-semibold focus:text-red-700 focus:bg-red-200"
            >
              <TrashIcon /> {deleteItemTitle}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActionsMenu;
