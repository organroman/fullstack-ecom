import React, { Dispatch, SetStateAction, ReactNode } from "react";
import { ChevronLeftIcon, LayoutGridIcon, TableIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import Search from "@/components/Search";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ModalVariant {
  variant: "modal";
  dialogContent: ReactNode;
  dialogButtonLabel: string;
  dialogOpen: boolean;
  dialogHandleOpen: Dispatch<SetStateAction<boolean>>;
}

interface PageVariant {
  variant: "page";
  link: string;
  btnLabel: string;
}

type CreateItemVariant = ModalVariant | PageVariant | undefined;

interface HeaderProps {
  title: string;
  searchPhrase?: string | "";
  setSearchPhrase?: Dispatch<SetStateAction<string>>;
  onSearch?: (newSearch: string) => void;
  filterComponent?: ReactNode;
  createItemVariant?: CreateItemVariant;
  page?: {};
  entityView?: string;
  handleEntityView?: () => void;
  backBtn?: boolean;
}
const Header = ({
  title,
  searchPhrase,
  setSearchPhrase,
  onSearch,
  filterComponent,
  createItemVariant,
  entityView,
  handleEntityView,
  backBtn = false,
}: HeaderProps) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-row items-center justify-between pt-4">
      <div className="flex items-center gap-4">
        {backBtn && (
          <Button onClick={goBack} className="text-md [&_svg]:size-5">
            <ChevronLeftIcon />
            Back
          </Button>
        )}

        <h2 className="text-3xl">{title}</h2>
      </div>
      <div className="flex items-center justify-end gap-4">
        {setSearchPhrase && searchPhrase !== undefined && (
          <Search
            searchPhrase={searchPhrase}
            handleSearch={onSearch || (() => {})}
            onChange={setSearchPhrase}
          />
        )}
        {filterComponent}
        {createItemVariant?.variant === "modal" && (
          <Dialog
            open={createItemVariant.dialogOpen}
            onOpenChange={createItemVariant.dialogHandleOpen}
          >
            <DialogTrigger asChild>
              <Button>{createItemVariant.dialogButtonLabel}</Button>
            </DialogTrigger>
            {createItemVariant.dialogContent}
          </Dialog>
        )}
        {createItemVariant?.variant === "page" && (
          <Button onClick={() => router.push(createItemVariant.link)}>
            {createItemVariant.btnLabel}
          </Button>
        )}
        {entityView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  onClick={handleEntityView}
                  className="[&_svg]:size-6"
                >
                  {entityView === "grid" ? <LayoutGridIcon /> : <TableIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p>Switch to {entityView === "grid" ? "table" : "grid"} view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default Header;
