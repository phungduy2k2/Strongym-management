"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

function MemberHeader({ user }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  const menuItems = [
    {
      label: "Trang chủ",
      path: "/",
      show: true,
    },
    {
      label: "Bài viết",
      path: "/blog",
      show: true,
    },
    {
      label: "Khóa học",
      path: "/class",
      show: true,
    },
    {
      label: "Đăng nhập",
      path: "/sign-in",
      show: !user,
    },
    {
      label: "Đăng ký",
      path: "/sign-up",
      show: !user,
    },
  ];

  
  return (!isAdminRoute &&
    <div className="w-full">
      <header className="flex h-15 p-3 pl-10 w-full shrink-0 justify-between items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden">
              <AlignJustify className="h-6 w-6" />
              <span className="sr-only">Toggle Navigation Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="mr-6 lg:flex" href={"#"}>
              <h3>StronGym</h3>
            </Link>
            <div className="grid gap-2 py-6">
              {menuItems.map((menuItem) => (
                menuItem.show ? (
                  <Link
                    key={menuItem.label}
                    href={menuItem.path}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    {menuItem.label}
                  </Link>
                ) : null
              ))}
              <UserButton afterSignOutUrl="/"/>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          className="hidden font-bold text-3xl lg:flex pl-15"
          href={"/"}
        >
          StronGym
        </Link>

        <nav className="ml-auto hidden lg:flex">
          {menuItems.map((menuItem) => (
            menuItem.show ? (
            <Link
              key={menuItem.label}
              href={menuItem.path}
              className="group inline-flex h-9 w-max items-center rounded-md px-4 py-2 text-sm font-medium"
            >
              {menuItem.label}
            </Link>
            ) : null
          ))}
          <UserButton afterSignOutUrl="/"/>
        </nav>
      </header>
    </div>
  );
}

export default MemberHeader;
