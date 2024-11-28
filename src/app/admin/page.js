"use client"

import AdminHeader from "@/components/admin-header";

export default function AdminView() {
  return (
    <div className="felx flex-col w-full">
      <AdminHeader />
      <main>
        <div className="flex justify-center">ADMIN DASHBOARD</div>
      </main>
    </div>
  );
}
