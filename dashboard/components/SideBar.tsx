"use client";

import { cn, hasPermission } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { Loader } from "lucide-react";

import { PiNotebookDuotone, PiNotebookFill } from "react-icons/pi";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { PERMISSIONS } from "@/lib/permissions";

import { getUser } from "@/features/users/api/users";

import AvatarMenu from "./AvatarMenu";
import { Separator } from "./ui/separator";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: GoHome,
    activeIcon: GoHomeFill,
    permission: PERMISSIONS.dashboard,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
    permission: PERMISSIONS.products,
  },

  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: PiNotebookDuotone,
    activeIcon: PiNotebookFill,
    permission: PERMISSIONS.orders,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: HiOutlineUsers,
    activeIcon: HiUsers,
    permission: PERMISSIONS.users,
  },
];

type SideBarProps = {
  role: string;
  userId: string;
};

const SideBar = ({ role, userId }: SideBarProps) => {
  const pathName = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUser(userId),
  });

  //TODO: Moibile Sidebar

  return (
    <aside className="h-full p-4 py-8 w-full border-r flex flex-col gap-4">
      <Link href="/dashboard" className="flex flex-row items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={48} height={48} />
        <span className="text-2xl text-neutral-800 dark:text-slate-200">
          E-comm
        </span>
      </Link>
      <Separator />
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <AvatarMenu data={data} />
      )}
      <Separator />
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
            hasPermission(route.permission, role) && (
              <Link key={route.href} href={route.href}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover: text-primary transition text-slate-700 dark:text-slate-300",
                    isActive &&
                      "bg-blue-200 dark:bg-blue-500 shadow-sm hover:opacity-100 text-blue-500 dark:text-slate-200"
                  )}
                >
                  <Icon className="size-5 text-blue-500 dark:text-slate-300" />
                  {route.label}
                </div>
              </Link>
            )
          );
        })}
      </ul>
    </aside>
  );
};

export default SideBar;
