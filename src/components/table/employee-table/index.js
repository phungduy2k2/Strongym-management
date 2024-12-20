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
import { ChevronDown, ChevronsUpDown, ChevronUp, Upload } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { EmployeeDetailsDialog } from "@/components/dialog/employee-details-dialog";
import * as XLSX from "xlsx";
import { format } from "date-fns";

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

  const handleExportExcel = () => {
    const columns = [
      { header: 'STT', key: 'index' },
      { header: "Họ và tên", key: "name" },
      { header: 'Ngày sinh', key: 'birth' },
      { header: 'Giới tính', key: 'gender' },
      { header: 'Số điện thoại', key: 'phone' },
      { header: 'CCCD', key: 'idCard' },
      { header: 'Địa chỉ', key: 'address' },
      { header: 'Vị trí', key: 'position' },
    ]

    const data = employees.map((employee, index) => ({
      index: index + 1,
      name: employee.name,
      birth: employee.birth ? format(new Date(employee.birth), "dd-MM-yyyy") : "",
      gender: employee.gender === true ? "Nam" : "Nữ",
      phone: employee.phone,
      idCard: employee.idCard,
      address: employee.address,
      position: employee.position
    }))

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [columns.map(col => col.header)], { origin: "A1" })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân viên")
    XLSX.writeFile(workbook, "DS_Nhanvien.xlsx")
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
          <Label className="italic mr-3 font-bold text-gray-600">Tổng: {paginatedEmployees.length}</Label>
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
                Số dòng: {itemsPerPage}
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
              <TableHead className="max-w-[15%] text-white">Ngày sinh</TableHead>
              <TableHead className="max-w-[15%] text-white">Số điện thoại</TableHead>
              <TableHead className="max-w-[20%] text-white">CCCD/CMT</TableHead>
              <TableHead className="max-w-[15%] text-white">
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
                <TableCell>{format(new Date(employee.birth), "dd-MM-yyyy")}</TableCell>
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
