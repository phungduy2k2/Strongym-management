"use client";

import {
  ChartPie,
  DumbbellIcon,
  HandCoins,
  Home,
  UserCog,
  UsersRound,
  Trello,
  IdCardIcon,
  ScrollText,
  Fullscreen,
  ListCollapse,
  ChevronDown,
  Settings
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
  useSidebar,
} from "../ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useEffect, useState } from "react";

export function AdminSidebar({ userInfo }) {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const { state } = useSidebar;

  const isManager = userInfo.role === "manager";

  const items = [
    {
      title: "Trang chủ",
      url: "/admin",
      icon: ChartPie,
      show: true,
    },
    {
      title: "Thành viên",
      url: "/admin/member",
      icon: UsersRound,
      show: isManager,
    },
    {
      title: "Nhân viên",
      url: "/admin/employee",
      icon: UserCog,
      show: isManager,
    },
    {
      title: "Lớp học",
      url: "/admin/class",
      icon: Trello,
      show: isManager,
    },
    {
      title: "Quản lý",
      icon: Settings,
      show: isManager,
      subItems: [
        {
          title: "Gói tập",
          url: "/admin/membership",
          icon: IdCardIcon,
        },
        {
          title: "Bài viết",
          url: "/admin/blog",
          icon: ScrollText,
        },
        {
          title: "Sự kiện",
          url: "/admin/event",
          icon: Fullscreen,
        },
        {
          title: "Thiết bị",
          url: "/admin/equipment",
          icon: DumbbellIcon,
        },
      ]
    },
    {
      title: "Doanh thu",
      url: "/admin/payment",
      icon: HandCoins,
      show: isManager,
    },
    {
      title: "Lớp học",
      url: "/admin/trainer/class",
      icon: Trello,
      show: !isManager,
    },
    {
      title: "Bài viết",
      url: "/admin/trainer/blog",
      icon: ScrollText,
      show: !isManager,
    }
  ];

  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapseOpen(false)
    }
  }, [state])

  return (
    <Sidebar collapsible="icon">
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
                  item.show ? 
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <Collapsible open={isCollapseOpen} onOpenChange={setIsCollapseOpen}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between" tooltip={item.title}>
                            <div className="flex gap-2 items-center">
                              <item.icon className="!size-6"/>
                              <span className="text-xl group-data-[collapsible=icon]:hidden">{item.title}</span>
                            </div>
                            <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                                isCollapseOpen ? "rotate-180" : ""
                              }`}/>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 ml-6 mt-2 group-data-[collapsible=icon]:ml-0">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild tooltip={subItem.title}>
                                <a href={subItem.url} className="group-data-[collapsible=icon]:justify-center">
                                  <subItem.icon className="!size-6"/>
                                  <span className="text-xl group-data-[collapsible=icon]:hidden">{subItem.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url} className="">
                          <item.icon className="!size-6"/>
                          <span className="text-xl ">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                  : null
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ----- Footer ----- */}
      <SidebarFooter className="bg-primary text-white">
        <div className="flex ml-1 mb-4 items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <span className="group-data-[collapsible=icon]:hidden">{userInfo.username}</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
