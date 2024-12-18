"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ChevronDown, ChevronsUpDown, ChevronUp, Upload } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { MemberDetailsDialog } from "../../dialog/member-details-dialog";
import { Label } from "../../ui/label";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export default function MemberTable({ members, plans, onUpdateMember, onDeleteMember }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortrColumn] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filterMembers = useCallback((member) => {
    // if (!member || !member.name || !member.phone) return false;
    return (
      member.name.toLowerCase().includes(debouncedFilterValue.toLowerCase()) ||
      member.phone.includes(debouncedFilterValue)
    )
  }, [debouncedFilterValue])

  const filteredMembers = useMemo(() => {
    return members.filter(filterMembers);
  }, [members, filterMembers]);

  const sortedMembers = useMemo(() => {
    if (!sortColumn) return filteredMembers;
    return [...filteredMembers].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredMembers, sortColumn, sortDirection]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMembers, currentPage, itemsPerPage]);
  const pageCount = Math.ceil(sortedMembers.length / itemsPerPage);
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev) === "asc" ? "desc" : "asc")
    } else {
      setSortrColumn(column)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (column) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const handleRowClick = (member) => {
    setSelectedMember({ ...member })
    setIsDialogOpen(true)
  }

  const handleSave = (updatedMember) => {
    onUpdateMember(updatedMember._id, updatedMember);
    setIsDialogOpen(false)
  }

  const handleExportExcel = () => {
    const columns = [
      { header: 'STT', key: 'index' },
      { header: "Họ và tên", key: "name" },
      { header: 'Ngày sinh', key: 'birth' },
      { header: 'Giới tính', key: 'gender' },
      { header: 'Số điện thoại', key: 'phone' },
      { header: 'Địa chỉ', key: 'address' },
      { header: 'Ngày đăng ký', key: 'createdAt' },
      { header: 'Ngày kết thúc', key: 'expiredDate' },
      { header: 'Gói tập', key: 'membershipPlanId' },
      { header: 'Trạng thái', key: 'status' },
    ]

    const data = members.map((member, index) => ({
      index: index + 1,
      name: member.name,
      birth: member.birth ? format(new Date(member.birth), "dd-MM-yyyy") : "",
      gender: member.gender === true ? "Nam" : "Nữ",
      phone: member.phone,
      address: member.address,
      createdAt: member.createdAt ? format(new Date(member.createdAt), "dd-MM-yyyy") : "",
      expiredDate: member.expiredDate ? format(new Date(member.expiredDate), "dd-MM-yyyy") : "",
      membershipPlanId: member.membershipPlanId?.name || "",
      status: member.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [columns.map(col => col.header)], { origin: "A1" })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thành viên")
    XLSX.writeFile(workbook, "DS_Thanhvien.xlsx")
  }

  return (
    <div className="space-y-4">
      {/* ----- Filter Input and ItemsPerPage -----  */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Lọc theo tên hoặc số điện thoại..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none transition-shadow"
        />
        <div className="flex space-x-2 items-center">
          <Label className="mr-3 italic font-bold text-gray-600">Tổng: {members.length}</Label>
          <Button 
            onClick={handleExportExcel}
            className="mr-3 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow"
          >
            Xuất Excel
            <Upload/>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button varian="outline" className="ml-auto bg-primary">
                Số dòng mỗi trang: {itemsPerPage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[10, 15, 20, 30, 40].map((pageSize) => (
                <DropdownMenuCheckboxItem
                  key={pageSize}
                  className="capitalize"
                  checked={pageSize === itemsPerPage}
                  onCheckedChange={() => setItemsPerPage(pageSize)}
                >
                  {pageSize}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* ----- Table -----  */}
      <div className="rounded-md border">
        <Table>
          {/* ----- Table Header ----- */}
          <TableHeader className="bg-primary">
            <TableRow className="hover:bg-primary">
              <TableHead className="max-w-[5%] text-center text-white">STT</TableHead>
              <TableHead className="max-w-[30%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="w-full justify-start items-center"
                >
                  Họ và tên
                  {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="max-w-[10%] text-white">Giới tính</TableHead>
              <TableHead className="max-w-[15%] text-white">Ngày sinh</TableHead>
              <TableHead className="max-w-[15%] text-white">Số điện thoại</TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="w-full items-center"
                >
                  Ngày đăng ký
                  {renderSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("expiredDate")}
                  className="w-full items-center"
                >
                  Ngày kết thúc
                  {renderSortIcon("expiredDate")}
                </Button>
              </TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="w-full items-center"
                >
                  Trạng thái
                  {renderSortIcon("status")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ----- Table Body ----- */}
          <TableBody>
            {paginatedMembers.map((member, index) => (
              <TableRow 
                key={member.id}
                className="transition-colors hover:bg-muted/50"
                onClick={() => handleRowClick(member)}
              >
                <TableCell className="font-medium text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.gender ? "Nam" : "Nữ"}</TableCell>
                <TableCell>{format(new Date(member.birth), "dd-MM-yyyy")}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell className="text-center">{format(new Date(member.createdAt), "dd-MM-yyyy")}</TableCell>
                <TableCell className="text-center">{format(new Date(member.expiredDate), "dd-MM-yyyy")}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ----- Pagination -----  */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            />
          </PaginationItem>
          
          {[...Array(pageCount)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault;
                  setCurrentPage(i + 1);
                }}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, pageCount));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* ----- Dialog -----  */}
      <MemberDetailsDialog
        member={selectedMember}
        plans={plans}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        onDelete={onDeleteMember}
      />
    </div>
  );
}
