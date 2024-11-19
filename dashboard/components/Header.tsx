"use client";

import { usePathname } from "next/navigation";
import MobileSidebar from "./MobileSidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";

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
};
const defaultMap = {
  plural: "Dashboard",
  single: "Dashboard",
};

const Header = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/").splice(1);
  const pathnameKey = pathnameParts[1] as keyof typeof partsMap;
  console.log("🚀 ~ pathnameKey:", pathnameKey);

  console.log("🚀 ~ pathnameParts:", pathnameParts);

  const { plural, single } = partsMap[pathnameKey] || defaultMap;
  console.log("🚀 ~ title:");
  console.log(pathname);
  return (
    <nav className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-blue-300">
      <div className="flex items-center gap-5">
        <h3 className="text-xl">
          {pathnameParts.length > 2 ? single : plural}
        </h3>
      </div>
      <MobileSidebar />
      <Avatar className="bg-black">
        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
        <AvatarFallback className="bg-black text-white">RO</AvatarFallback>
      </Avatar>
      {/* <Button value="secondary" asChild>
        <Link href="/dashboard/products/create">Create Product</Link>
      </Button> */}
    </nav>
  );
};

export default Header;
