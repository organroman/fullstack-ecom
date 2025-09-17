import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SideBar from "@/components/SideBar";
import { getRoleAndUserFromToken } from "@/lib/utils";
import MobileSidebar from "@/components/MobileSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const usersToken = cookies().get("auth-token")?.value;

  if (!usersToken) {
    redirect("/login");
  }

  const userData = getRoleAndUserFromToken(usersToken);

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex w-full h-full">
        <div className="hidden lg:block lg:w-[264px] h-full">
          <SideBar
            role={userData.role}
            userId={userData.userId}
            token={usersToken}
          />
          <div className="flex lg:hidden ">
            <MobileSidebar
              role={userData.role}
              userId={userData.userId}
              token={usersToken}
            />
          </div>
        </div>
        <div className=" w-full">
          <div className="flex flex-col mx-auto max-w-screen-2xl h-full">
            <main className="flex-grow h-0 py-4 px-6 mb-2">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
