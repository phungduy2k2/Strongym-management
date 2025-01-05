"use client";

import { EquipmentDialog } from "@/components/dialog/equipment-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createEquipment, updateEquipment } from "@/services/equipment";
import { format } from "date-fns";
import { ChevronDown, ChevronsUpDown, ChevronUp, CirclePlus, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import * as XLSX from "xlsx";

export default function EquipmentTable({ eqms, onSave, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortrColumn] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEqm, setSelectedEqm] = useState(null)

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filterEqms = useCallback(
    (eqm) => {
      return eqm.name
        .toLowerCase()
        .includes(debouncedFilterValue.toLowerCase());
    },
    [debouncedFilterValue]
  );

  const filteredEqms = useMemo(() => {
    return eqms.filter(filterEqms);
  }, [eqms, filterEqms]);

  const sortedEqms = useMemo(() => {
    if (!sortColumn) return filteredEqms;
    return [...filteredEqms].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredEqms, sortColumn, sortDirection]);

  const paginatedEqms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEqms.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEqms, currentPage, itemsPerPage]);
  const pageCount = Math.ceil(sortedEqms.length / itemsPerPage);
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

  const rowClick = (eqm) => {
    setSelectedEqm(eqm)
    setIsDialogOpen(true)
  };

  const handleSave = async (updatedEqm) => {
    onSave(updatedEqm);
    setIsDialogOpen(false)
  };

  const handleExportExcel = () => {
    const columns = [
      { header: "STT", key: "index" },
      { header: "Tên thiết bị", key: "name" },
      { header: "Số lượng", key: "quantity" },
      { header: "Ngày bảo trì kế tiếp", key: "nextMaintenanceDate" },
    ];

    const data = eqms.map((eqm, index) => ({
      index: index + 1,
      name: eqm.name,
      quantity: eqm.quantity,
      nextMaintenanceDate: eqm.nextMaintenanceDate
        ? format(new Date(eqm.nextMaintenanceDate), "dd-MM-yyyy")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [columns.map((col) => col.header)], {
      origin: "A1",
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thiết bị");
    XLSX.writeFile(workbook, "DS_Thietbi.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="min-w-screen mb-6 flex justify-between items-center">
        <span className="text-3xl font-bold">Quản lý thiết bị</span>
        {/* ----- Button "Thêm" ----- */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm thiết bị
          <CirclePlus />
        </Button>
      </div>


      {/* ----- Filter Input and ItemsPerPage -----  */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Lọc thiết bị theo tên..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none transition-shadow"
        />
        <div className="flex space-x-2 items-center">
          <Label className="mr-3 italic font-bold text-gray-600">
            Tổng: {filteredEqms.length}
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

      {/* ----- Table ----- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow className="hover:bg-primary">
              <TableHead className="max-w-[5%] text-center text-white">
                STT
              </TableHead>
              <TableHead className="max-w-[40%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="w-full justify-start items-center"
                >
                  Tên thiết bị
                  {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="max-w-[10%] text-white text-center">Số lượng</TableHead>
              <TableHead className="max-w-[30%] text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("nextMaintenanceDate")}
                  className="w-full items-center"
                >
                  Ngày bảo trì tới
                  {renderSortIcon("nextMaintenanceDate")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ----- Table Body ----- */}
          <TableBody>
            {paginatedEqms.map((eqm, index) => (
              <TableRow
                key={eqm.id}
                className="transition-colors hover:bg-muted/50"
                onClick={() => rowClick(eqm)}
              >
                <TableCell className="text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="truncate">{eqm.name}</TableCell>
                <TableCell className="text-center">{eqm.quantity}</TableCell>
                <TableCell className="text-center">
                  {format(new Date(eqm.nextMaintenanceDate), "dd-MM-yyyy")}
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
      <EquipmentDialog
        isOpen={isDialogOpen}
        onClose={() => {
            setIsDialogOpen(false)
            setSelectedEqm(null)
        }}
        onSave={handleSave}
        onDelete={onDelete}
        equipment={selectedEqm}
        key={selectedEqm ? selectedEqm._id : "new"}
      />
    </div>
  );
}
