import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const user = await currentUser();
  if(!user) redirect("/")
  const userInfo = await getUserById(user.id);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-[90%]">
        <AdminSidebar userInfo={userInfo.data} />
        <div className="flex-1">
          <div className="py-2 px-1 sm:px-1 lg:px-2">
            <SidebarTrigger />
          </div>
          <div className="mx-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
