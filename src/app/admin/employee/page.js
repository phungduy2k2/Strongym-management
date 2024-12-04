"use client"

import EmployeeTable from "@/components/table/employee-table"



export default function EmployeePage() {
    return (
        <div className="flex flex-col">
            <span className="text-3xl font-bold">Admin/Trang Nhân Viên</span>
            <EmployeeTable/>
        </div>
    )
}
