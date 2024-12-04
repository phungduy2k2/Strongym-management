"use client";

import Link from "next/link";

function AdminHeader() {
  const menus = [
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
        <Link
          className="font-bold text-3xl lg:flex pl-15"
          href={"/admin"}
        >
          StronGym
        </Link>

        <nav className="ml-auto lg:flex">
          {menus.map((menuItem) => (
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
