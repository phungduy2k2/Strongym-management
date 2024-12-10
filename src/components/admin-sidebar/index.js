"use client";

import {
  ChartPie,
  DumbbellIcon,
  HandCoins,
  Home,
  UserCog,
  UsersRound,
  Trello,
  IdCardIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { UserButton } from "@clerk/nextjs";
// import LanguageSwitcher from "../language-switcher";

export function AdminSidebar({ ...props }) {
  const items = [
    {
      title: "Trang chủ",
      url: "/admin",
      icon: ChartPie,
    },
    {
      title: "Thành viên",
      url: "/admin/member",
      icon: UsersRound,
    },
    {
      title: "Nhân viên",
      url: "/admin/employee",
      icon: UserCog,
    },
    {
      title: "Lớp học",
      url: "/admin/class",
      icon: Trello,
    },
    {
      title: "Thiết bị",
      url: "/admin/equipment",
      icon: DumbbellIcon,
    },
    {
      title: "Gói tập",
      url: "/admin/membership",
      icon: IdCardIcon,
    },
    {
      title: "Doanh thu",
      url: "/admin/revenue",
      icon: HandCoins,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ----- Header ----- */}
      <SidebarHeader className="bg-primary text-white">
        <SidebarMenu>
          <SidebarMenuItem className="hover:bg-primary">
            <SidebarMenuButton asChild>
              <a href="#">
                <Home className="!size-6" />
                <span className="text-2xl">StronGym</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ----- Content ----- */}
      <SidebarContent className="bg-primary text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex flex-col mt-5 gap-[1.5rem]">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url} className="">
                        <item.icon className="!size-6"/>
                        <span className="text-xl">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <div className="mt-auto p-4">
          <LanguageSwitcher />
        </div> */}
      </SidebarContent>

      {/* ----- Footer ----- */}
      <SidebarFooter className="bg-primary text-white">
        <div className="flex ml-1 mb-4 items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <span>Tài khoản</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
