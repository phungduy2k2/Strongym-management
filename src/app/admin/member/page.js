"use client"

import MemberTable from "@/components/table/member-table"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"

export default function MemberPage() {
    return (
        <div className="flex flex-col">
            <div className="w-full flex space-between">
                <span className="text-3xl font-bold">Admin/Trang Thành Viên</span>
                
            </div>
            <MemberTable/>
        </div>
    )
}