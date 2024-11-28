"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";

function AdminHeader() {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
    },
    {
      label: "Member",
      path: "/admin/member",
    },
    {
      label: "Employee",
      path: "/admin/employee",
    },
  ];

  return (
    <div>
      <header className="flex h-15 p-3 pl-10 w-full shrink-0 justify-between items-center bg-[#333333] text-[#ef3333]">
        {/* <Sheet>
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
                <Link
                  href={menuItem.path}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  {menuItem.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet> */}

        <Link
          className="font-bold text-3xl lg:flex pl-15"
          href={"/admin"}
        >
          StronGym
        </Link>

        <nav className="ml-auto lg:flex">
          {menuItems.map((menuItem) => (
            <Link
              href={menuItem.path}
              className="group inline-flex h-9 w-max items-center rounded-md px-4 py-2 text-sm font-medium"
            >
              {menuItem.label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}

export default AdminHeader;
