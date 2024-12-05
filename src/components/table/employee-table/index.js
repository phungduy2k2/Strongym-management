"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
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
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { EmployeeDetailsDialog } from "@/components/dialog/employee-details-dialog";

// Mock data
// const employees = [
//     { id: 1, name: "Hoàng Như Cường", birth: "2002-03-17", gender: "Nam", phone: "0912345678", idCard: "123456789", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "123 Đường Trần Phú, Hà Nội", position: "Quản lý", createdAt: "2020-01-01" },
//     { id: 2, name: "Trần Thị Mai", birth: "1992-08-20", gender: "Nữ", phone: "0933456789", idCard: "987654321123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "456 Đường Lê Lợi, TP. Hồ Chí Minh", position: "Lễ tân", createdAt: "2024-01-02" },
//     { id: 3, name: "Phạm Quốc Tuấn", birth: "1988-03-12", gender: "Nam", phone: "0944567890", idCard: "345678912", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "789 Đường Nguyễn Huệ, Đà Nẵng", position: "PT", createdAt: "2024-01-03" },
//     { id: 4, name: "Lê Hoàng Yến", birth: "1995-07-25", gender: "Nữ", phone: "0965678901", idCard: "456789123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "123 Đường Hùng Vương, Hải Phòng", position: "Quản lý", createdAt: "2024-01-04" },
//     { id: 5, name: "Vũ Văn Dũng", birth: "1987-11-10", gender: "Nam", phone: "0986789012", idCard: "567891234", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "456 Đường Nguyễn Trãi, Cần Thơ", position: "Bảo vệ", createdAt: "2024-01-05" },
//     { id: 6, name: "Hoàng Thị Thu", birth: "1990-02-18", gender: "Nữ", phone: "0997890123", idCard: "678912345123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "789 Đường Hai Bà Trưng, Huế", position: "Nhân viên vệ sinh", createdAt: "2024-01-06" },
//     { id: 7, name: "Nguyễn Đình Quân", birth: "1989-09-09", gender: "Nam", phone: "0908901234", idCard: "789123456", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "123 Đường Bạch Đằng, Nha Trang", position: "PT", createdAt: "2024-01-07" },
//     { id: 8, name: "Đặng Văn Sơn", birth: "1985-06-30", gender: "Nam", phone: "0919012345", idCard: "912345678", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "456 Đường Lý Tự Trọng, Hải Dương", position: "Bảo vệ", createdAt: "2024-01-08" },
//     { id: 9, name: "Phạm Thị Lan", birth: "1993-04-05", gender: "Nữ", phone: "0920123456", idCard: "123456789123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "789 Đường Nguyễn Du, Quảng Ninh", position: "Lễ tân", createdAt: "2024-01-09" },
//     { id: 10, name: "Trần Quốc Hùng", birth: "1991-01-21", gender: "Nam", phone: "0931234567", idCard: "234567891", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "123 Đường Điện Biên Phủ, Lâm Đồng", position: "PT", createdAt: "2024-01-10" },
//     { id: 11, name: "Nguyễn Thị Lý", birth: "1986-10-15", gender: "Nữ", phone: "0942345678", idCard: "345678912123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "456 Đường Trường Chinh, Bình Dương", position: "Nhân viên vệ sinh", createdAt: "2024-01-11" },
//     { id: 12, name: "Lê Văn Hảo", birth: "1984-07-03", gender: "Nam", phone: "0953456789", idCard: "456789123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "789 Đường Hoàng Văn Thụ, An Giang", position: "Bảo vệ", createdAt: "2024-01-12" },
//     { id: 13, name: "Vũ Thị Hạnh", birth: "1994-09-12", gender: "Nữ", phone: "0964567890", idCard: "567891234123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "123 Đường Lê Duẩn, Nam Định", position: "Lễ tân", createdAt: "2024-01-13" },
//     { id: 14, name: "Phan Văn Đức", birth: "1990-11-19", gender: "Nam", phone: "0975678901", idCard: "678912345", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "456 Đường Phạm Ngũ Lão, Bà Rịa", position: "Quản lý", createdAt: "2024-01-14" },
//     { id: 15, name: "Ngô Thị Minh", birth: "1992-12-07", gender: "Nữ", phone: "0986789012", idCard: "789123456123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "789 Đường Nguyễn Trường Tộ, Hưng Yên", position: "Nhân viên vệ sinh", createdAt: "2024-01-15" },
//     { id: 16, name: "Đinh Văn Lâm", birth: "1985-08-29", gender: "Nam", phone: "0997890123", idCard: "890123456", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "123 Đường Lý Chính Thắng, Đà Lạt", position: "PT", createdAt: "2024-01-16" },
//     { id: 17, name: "Trần Thị Hiền", birth: "1988-06-14", gender: "Nữ", phone: "0908901234", idCard: "901234567123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "456 Đường Phan Chu Trinh, Sóc Trăng", position: "Lễ tân", createdAt: "2024-01-17" },
//     { id: 18, name: "Nguyễn Văn Quý", birth: "1987-04-27", gender: "Nam", phone: "0919012345", idCard: "123456789", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "789 Đường Đinh Tiên Hoàng, Vĩnh Long", position: "Quản lý", createdAt: "2024-01-18" },
//     { id: 19, name: "Lê Thị Lan", birth: "1993-05-09", gender: "Nữ", phone: "0920123456", idCard: "234567891123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "123 Đường Trần Nhật Duật, Tiền Giang", position: "Nhân viên vệ sinh", createdAt: "2024-01-19" },
//     { id: 20, name: "Phạm Văn Lộc", birth: "1990-09-03", gender: "Nam", phone: "0931234567", idCard: "345678912", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "456 Đường Trần Quốc Toản, Bình Phước", position: "Bảo vệ", createdAt: "2024-01-20" },
//     { id: 21, name: "Hoàng Thị Luyến", birth: "1991-07-16", gender: "Nữ", phone: "0942345678", idCard: "456789123123", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556509.png", address: "789 Đường Bùi Thị Xuân, Đồng Nai", position: "Lễ tân", createdAt: "2024-01-21" },
//     { id: 22, name: "Ngô Văn Khánh", birth: "1986-02-20", gender: "Nam", phone: "0953456789", idCard: "567891234", imageUrl: "https://cdn-icons-png.flaticon.com/512/5556/5556468.png", address: "123 Đường Lê Hồng Phong, Phú Yên", position: "PT", createdAt: "2024-01-22" },
// ];

export default function EmployeeTable({ employees, onUpdate, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortrColumn] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filterEmployees = useCallback((employee) => {
    return (
      employee.name.toLowerCase().includes(debouncedFilterValue.toLowerCase()) ||
      employee.phone.includes(debouncedFilterValue)
    );
  }, [debouncedFilterValue]);
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(filterEmployees);
  }, [employees, filterEmployees]);

  const sortedEmployees = useMemo(() => {
    if (!sortColumn) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredEmployees, sortColumn, sortDirection]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage, itemsPerPage]);
  const pageCount = Math.ceil(sortedEmployees.length / itemsPerPage);

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

  const rowClick = (employee) => {
    setSelectedEmployee({ ...employee })
    setIsDialogOpen(true)
  }

  const handleSave = (updatedEmployee) => {
    onUpdate(updatedEmployee._id, updatedEmployee);
    setIsDialogOpen(false)
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
        <div>
          <Label className="italic mr-3 font-bold text-gray-600">Tổng: {employees.length}</Label>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button varian="outline" className="ml-auto bg-primary">
              Số dòng mỗi trang: {itemsPerPage}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[10, 15, 20, 30].map((pageSize) => (
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
              <TableHead className="w-[50px] text-center text-white">STT</TableHead>
              <TableHead className="w-[200px] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="w-full justify-start items-center"
                >
                  Họ và tên
                  {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px] text-white">Giới tính</TableHead>
              <TableHead className="w-[130px] text-white">Số điện thoại</TableHead>
              <TableHead className="w-[130px] text-white">CCCD/CMT</TableHead>
              <TableHead className="w-[150px] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("position")}
                  className="w-full justify-start items-center"
                >
                  Vị trí
                  {renderSortIcon("position")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ----- Table Body ----- */}
          <TableBody>
            {paginatedEmployees.map((employee, index) => (
              <TableRow 
                key={employee.id}
                className="transition-colors hover:bg-muted/50"
                onClick={() => rowClick(employee)}
              >
                <TableCell className="font-medium text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.gender ? "Nam" : "Nữ"}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.idCard}</TableCell>
                <TableCell>{employee.position}</TableCell>
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
      <EmployeeDetailsDialog
        employee={selectedEmployee}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        onDelete={onDelete}
      />
    </div>
  );
}
