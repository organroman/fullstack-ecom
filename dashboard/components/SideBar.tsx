"use client";

import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },

  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
];

const SideBar = () => {
  const pathName = usePathname();
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/dashboard" className="flex flex-row items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={48} height={48} />
        <span className="text-2xl text-neutral-800">E-commerce</span>
      </Link>
      <ul className="flex flex-col my-4">
        {routes.map((route) => {
          const pathnameParts = pathName.split("/");
          const pathNameForCompare =
            "/" +
            pathnameParts[1] +
            (pathnameParts[2] ? "/" + pathnameParts[2] : "");

          const isActive = pathNameForCompare === route.href;
          const Icon = isActive ? route.activeIcon : route.icon;
          return (
            <Link key={route.href} href={route.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover: text-primary transition text-neutral-500",
                  isActive &&
                    "bg-blue-200 shadow-sm hover:opacity-100 text-blue-800"
                )}
              >
                <Icon className="size-5 text-blue-500" />
                {route.label}
              </div>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
};

export default SideBar;
