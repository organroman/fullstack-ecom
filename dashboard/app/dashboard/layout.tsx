import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
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

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex w-full h-full">
        <div className="hidden lg:block lg:w-[264px] h-full">
          <SideBar />
        </div>
        <div className=" w-full">
          <div className="flex flex-col mx-auto max-w-screen-2xl h-full">
            <Header />
            <main className="flex-grow h-full py-4 px-6 mb-2 flex flex-col overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
