import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { getRoleFromToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const usersToken = cookies().get("auth-token")?.value;

  if (!usersToken) {
    redirect("/login");
  }

  const role = getRoleFromToken(usersToken);

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex w-full h-full">
        <div className="hidden lg:block lg:w-[264px] h-full">
          <SideBar role={role} />
        </div>
        <div className=" w-full">
          <div className="flex flex-col mx-auto max-w-screen-2xl h-full">
            <Header role={role} />
            <main className="flex-grow h-0 py-4 px-6 mb-2">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
