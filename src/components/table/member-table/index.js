"use client";

import { useMemo, useState } from "react";
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
import { ChevronDown, ChevronsUpDown, ChevronUp, CirclePlus } from "lucide-react";
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
import { AddMemberModal } from "@/components/modal/add-member-modal";

// Mock data
const members = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/5556/5556499.png",
    name: "Phùng Văn Duy",
    birth: "2002-11-01",
    gender: "Nam",
    phone: "0911183701",
    address: "55 Nguyễn Ngọc Nại, Thanh Xuân, Hà Nội",
    membershipPlanId: "Gói tập 4 tháng",
    registrationDate: "2024-09-25",
    endDate: "2025-01-25",
    status: "Valid"
  },
    { id: 2, name: "Trần Thị Mai", gender: "Nữ", phone: "0899990002", registrationDate: "01-03-2024", endDate: "01-04-2024", status: "Expired" },
    { id: 3, name: "Phạm Minh Quang", gender: "Nam", phone: "0909990003", registrationDate: "01-04-2024", endDate: "01-06-2024", status: "Valid" },
    { id: 4, name: "Lê Hoàng Sơn", gender: "Nam", phone: "0919990004", registrationDate: "01-05-2024", endDate: "01-07-2024", status: "Valid" },
    { id: 5, name: "Vũ Thị Hương", gender: "Nữ", phone: "0929990005", registrationDate: "01-06-2024", endDate: "01-08-2024", status: "Valid" },
    { id: 6, name: "Nguyễn Thị Lan", gender: "Nữ", phone: "0939990006", registrationDate: "01-07-2024", endDate: "01-09-2024", status: "Valid" },
    { id: 7, name: "Đinh Minh Thành", gender: "Nam", phone: "0949990007", registrationDate: "01-08-2024", endDate: "01-10-2024", status: "Valid" },
    { id: 8, name: "Trần Minh Hữu", gender: "Nam", phone: "0959990008", registrationDate: "01-09-2024", endDate: "01-11-2024", status: "Valid" },
    { id: 9, name: "Phan Thị Mai", gender: "Nữ", phone: "0969990009", registrationDate: "01-10-2024", endDate: "01-12-2024", status: "Valid" },
    { id: 10, name: "Nguyễn Văn Bình", gender: "Nam", phone: "0979990010", registrationDate: "01-11-2024", endDate: "01-01-2025", status: "Valid" },
    { id: 11, name: "Lê Thị Lan", gender: "Nữ", phone: "0989990011", registrationDate: "15-01-2024", endDate: "15-03-2024", status: "Expired" },
    { id: 12, name: "Trần Quang Hiếu", gender: "Nam", phone: "0999990012", registrationDate: "01-02-2024", endDate: "01-04-2024", status: "Expired" },
    { id: 13, name: "Phạm Minh Tuấn", gender: "Nam", phone: "0889990013", registrationDate: "01-03-2024", endDate: "01-05-2024", status: "Expired" },
    { id: 14, name: "Vũ Minh Quang", gender: "Nam", phone: "0899990014", registrationDate: "01-04-2024", endDate: "01-06-2024", status: "Valid" },
    { id: 15, name: "Nguyễn Phương Thanh", gender: "Nữ", phone: "0909990015", registrationDate: "01-05-2024", endDate: "01-07-2024", status: "Valid" },
    { id: 16, name: "Lê Anh Tuan", gender: "Nam", phone: "0919990016", registrationDate: "01-06-2024", endDate: "01-08-2024", status: "Valid" },
    { id: 17, name: "Trần Kiều Oanh", gender: "Nữ", phone: "0929990017", registrationDate: "01-07-2024", endDate: "01-09-2024", status: "Valid" },
    { id: 18, name: "Phạm Tuấn Anh", gender: "Nam", phone: "0939990018", registrationDate: "01-08-2024", endDate: "01-10-2024", status: "Valid" },
    { id: 19, name: "Nguyễn Thị Lan", gender: "Nữ", phone: "0949990019", registrationDate: "01-09-2024", endDate: "01-11-2024", status: "Valid" },
    { id: 20, name: "Lê Đức Kien", gender: "Nam", phone: "0959990020", registrationDate: "01-10-2024", endDate: "01-12-2024", status: "Valid" },
    { id: 21, name: "Trần Thị Hoa", gender: "Nữ", phone: "0969990021", registrationDate: "01-11-2024", endDate: "01-01-2025", status: "Valid" },
    { id: 22, name: "Phạm Quốc Tài", gender: "Nam", phone: "0979990022", registrationDate: "01-12-2024", endDate: "01-02-2025", status: "Valid" },
    { id: 23, name: "Nguyễn Anh Đào", gender: "Nữ", phone: "0989990023", registrationDate: "01-01-2024", endDate: "01-02-2024", status: "Expired" },
    { id: 24, name: "Lê Minh Thiện", gender: "Nam", phone: "0999990024", registrationDate: "01-02-2024", endDate: "01-04-2024", status: "Expired" },
    { id: 25, name: "Trần Thị Kim", gender: "Nữ", phone: "0889990025", registrationDate: "01-03-2024", endDate: "01-05-2024", status: "Expired" }
  ];
  

export default function MemberTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortrColumn] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        member.phone.includes(filterValue)
    );
  }, [filterValue]);

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
    console.log(member, 'selectedMember');
    
    setSelectedMember({ ...member })
    setIsDialogOpen(true)
  }

  const handleSave = (updatedMember) => {
    console.log('Saving updated member:', updatedMember);
    setIsDialogOpen(false)
  }

  const handleAddMember = (newMember) => {
    //// Gọi service add new member ở đây
    console.log('adding new member: ', newMember);
    members.push({ ...newMember, id: members.length + 1 })
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
          {/* ----- Button "Thêm" ----- */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm
            <CirclePlus/>    
          </Button>
        </div>
      </div>

      {/* ----- Table -----  */}
      <div className="rounded-md border">
        <Table>
          {/* ----- Table Header ----- */}
          <TableHeader className="bg-primary">
            <TableRow className="hover:bg-primary">
              <TableHead className="max-w-[5%] text-center text-white">STT</TableHead>
              <TableHead className="max-w-[25%] text-white">
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
              <TableHead className="max-w-[15%] text-white">Số điện thoại</TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("registrationDate")}
                  className="w-full items-center"
                >
                  Ngày đăng ký
                  {renderSortIcon("registrationDate")}
                </Button>
              </TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("endDate")}
                  className="w-full items-center"
                >
                  Ngày kết thúc
                  {renderSortIcon("endDate")}
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
                <TableCell>{member.gender}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell className="text-center">{member.registrationDate}</TableCell>
                <TableCell className="text-center">{member.endDate}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === "Valid"
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
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />

      {/* ----- Add New Member Modal -----  */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMember}
      />
    </div>
  );
}
