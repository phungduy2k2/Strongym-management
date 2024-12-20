"use client";

import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { format, isWithinInterval, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { ChevronDown, ChevronsUpDown, ChevronUp, CirclePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function PaymentTable({ payments }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortrColumn] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [dateRange, setDateRange] = useState([null, null]);
  const [filterValue, setFilterValue] = useState("");

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filterPayments = useCallback(
    (payment) => {
      const matchesText = payment.customer.toLowerCase().includes(debouncedFilterValue.toLowerCase())
        || payment.description.toLowerCase().includes(debouncedFilterValue.toLowerCase());
      const matchesDateRange = dateRange && dateRange[0] && dateRange[1]
        ? isWithinInterval(parseISO(payment.createdAt), { start: dateRange[0], end: dateRange[1] })
        : true;
      return matchesText && matchesDateRange;
    }, [debouncedFilterValue, dateRange]);

  const filteredPayments = useMemo(() => {
    return payments.filter(filterPayments);
  }, [payments, filterPayments, dateRange]);

  const sortedPayments = useMemo(() => {
    if (!sortColumn) return filteredPayments;
    return [...filteredPayments].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPayments, sortColumn, sortDirection]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPayments, currentPage, itemsPerPage]);
  const pageCount = Math.ceil(sortedPayments.length / itemsPerPage);
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortrColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const handleExportExcel = () => {
    const columns = [
        { header: "STT", key: "index" },
        { header: "Số tiền", key: "amount" },
        { header: "Khách hàng", key: "customer" },
        { header: "Nội dung", key: "descrtiption" },
        { header: "Phương thức", key: "paymentMethod" },
        { header: "Thời gian", key: "createdAt" },
    ];
  
    const data = paginatedPayments.map((payment, index) => ({
        index: index + 1,
        amount: payment.amount,
        customer: payment.customer,
        description: payment.description,
        paymentMethod: payment.paymentMethod,
        createdAt: new Date(payment.createdAt).toLocaleString("vi-VN")
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [columns.map((col) => col.header)], { origin: "A1" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Khoản thanh toán");
    XLSX.writeFile(workbook, "DS_ThanhToan.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="min-w-screen mb-6 flex justify-between items-center">
        <span className="text-3xl font-bold">
          Bảng danh sách các khoản thanh toán
        </span>
        {/* ----- Button "Thêm" ----- */}
        <Button
          //   onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm
          <CirclePlus />
        </Button>
      </div>

      {/* ----- Filter Input and ItemsPerPage -----  */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
        <Input
          placeholder="Lọc theo tên KH/nội dung..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none transition-shadow"
        />
        <DateRangePicker
          onChange={setDateRange}
          value={dateRange}
          format="dd-MM-yyyy"
          className="date-range-picker max-w-xs rounded-md"
          calendarClassName="custom-calendar"
        />
        </div>
        <div className="flex space-x-2 items-center">
          <Label className="mr-3 italic font-bold text-gray-600">
            Tổng: {payments.length}
          </Label>
          <Button
            onClick={handleExportExcel}
            className="mr-3 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow"
          >
            Xuất Excel
            <Upload />
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

      {/* ----- Table ----- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow className="hover:bg-primary">
              <TableHead className="max-w-[5%] text-center text-white">
                STT
              </TableHead>
              <TableHead className="max-w-[25%] text-white text-center">Số tiền</TableHead>
              <TableHead className="max-w-[25%] text-white">
                Khách hàng
              </TableHead>
              <TableHead className="max-w-[30%] text-white">Nội dung</TableHead>
              <TableHead className="max-w-[10%] text-white text-center">Phương thức</TableHead>
              <TableHead className="max-w-[15%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="w-full items-center"
                >
                  Thời gian
                  {renderSortIcon("createdAt")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ----- Table Body ----- */}
          <TableBody>
            {paginatedPayments.map((payment, index) => (
              <TableRow
                key={payment.id}
                className="transition-colors hover:bg-muted/50"
                onClick={() => rowClick(payment)}
              >
                <TableCell className="text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="text-center">
                  {payment.currency === "VND"
                    ? `${payment.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                    : payment.currency === "USD"
                    ? `${payment.amount} USD`
                    : `${payment.amount} EUR`}
                </TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell className="truncate">
                  {payment.description}
                </TableCell>
                <TableCell className="text-center">{payment.paymentMethod}</TableCell>
                <TableCell className="text-center">
                  {format(new Date(payment.createdAt), "dd-MM-yyyy")}
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

    </div>
  );
}
