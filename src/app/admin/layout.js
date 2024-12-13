import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-[90%]">
        <AdminSidebar />
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
