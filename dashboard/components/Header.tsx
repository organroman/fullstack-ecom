"use client";

import { usePathname, useRouter } from "next/navigation";
import MobileSidebar from "./MobileSidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";

const partsMap = {
  products: {
    plural: "Products",
    single: "Product Details",
  },
  orders: {
    plural: "Orders",
    single: "Order details",
  },
  settings: {
    plural: "Settings",
    single: "Settings",
  },
  users: {
    plural: "Users",
    single: "User",
  },
};
const defaultMap = {
  plural: "Dashboard",
  single: "Dashboard",
};

interface HeaderProps {
  role: string;
}

const Header = ({ role }: HeaderProps) => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/").splice(1);
  const pathnameKey = pathnameParts[1] as keyof typeof partsMap;

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const { plural, single } = partsMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-blue-300">
      <div className="flex items-center gap-5">
        <Button
          onClick={goBack}
          className="text-md [&_svg]:size-5"
          variant="outline"
        >
          <ChevronLeftIcon />
          Back
        </Button>
        <h3 className="text-xl">
          {pathnameParts.length > 2 ? single : plural}
        </h3>
      </div>
      <MobileSidebar role={role} />
      <Avatar className="bg-blue-500">
        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
        <AvatarFallback className="bg-blue-500 text-white">RO</AvatarFallback>
      </Avatar>
    </nav>
  );
};

export default Header;
