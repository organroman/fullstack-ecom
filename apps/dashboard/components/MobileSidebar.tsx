"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import SideBar from "./SideBar";

interface HeaderProps {
  role: string;
  userId: string;
  token: string | null;
}

const MobileSidebar = ({ role, userId, token }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SideBar role={role} userId={userId} token={token} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
