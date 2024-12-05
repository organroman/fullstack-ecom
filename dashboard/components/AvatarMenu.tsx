"use client";

import { IUser } from "@/types/types";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  LogOutIcon,
  Moon,
  Settings,
  Sun,
  UserRoundPenIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog } from "./ui/dialog";
import Modal from "./Modal";

import { removeCookie } from "@/lib/utils";

const AvatarMenu = ({ data }: { data: IUser | undefined }) => {
  const { setTheme } = useTheme();
  const router = useRouter();

  const [isOpenLogoutDialog, setIsOpenLogoutDialog] = useState<boolean>(false);

  const userNameArr = data?.name?.split(" ") || [];
  const name = userNameArr[0]?.charAt(0).toUpperCase() || "";
  const surname = userNameArr[1].charAt(0).toUpperCase() || "";
  const avatarFallbackName = name + surname;

  const handleLogout = () => {
    removeCookie("auth-token");
    router.refresh();
    toast.success("You logged out");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-row items-center gap-4">
            <Avatar className="cursor-pointer">
              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
              <AvatarFallback className="bg-blue-500 text-white">
                {avatarFallbackName}
              </AvatarFallback>
            </Avatar>
            <p>{data?.name}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${data?.id}`)}
          >
            <div className="flex flex-row items-center gap-2 px-2">
              <UserRoundPenIcon /> <span className="mx-2">View profile</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem>
                <div className="flex flex-row items-center gap-2 px-2">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="mx-2">Change theme</span>
                  <ChevronRight />
                </div>
              </DropdownMenuItem>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenuItem onClick={() => setIsOpenLogoutDialog(true)}>
            <div className="flex flex-row items-center gap-2 px-2">
              <LogOutIcon /> <span className="mx-2">Logout</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpenLogoutDialog} onOpenChange={setIsOpenLogoutDialog}>
        <Modal
          title="Logout"
          descriptionFirst="Are you sure you want to logout?"
          buttonActionTitle="Logout"
          buttonActionTitleContinuous="Leaving"
          action={() => handleLogout()}
          isPending={false}
          destructive
        />
      </Dialog>
    </>
  );
};

export default AvatarMenu;
