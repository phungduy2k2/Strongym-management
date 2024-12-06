"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const fields = [
  { label: "Họ và tên", name: "name", type: "text" },
  {
    label: "Ngày sinh",
    name: "birth",
    type: "date",
    format: (value) => format(new Date(value), "yyyy-MM-dd"),
  },
  {
    label: "Giới tính",
    name: "gender",
    type: "select",
    options: [
      { value: true, label: "Nam" },
      { value: false, label: "Nữ" },
    ],
  },
  { label: "Số điện thoại", name: "phone", type: "text" },
  { label: "CCCD/CMT", name: "idCard", type: "text" },
  { label: "Vị trí", name: "position", type: "text" },
  { label: "Địa chỉ", name: "address", type: "text" },
]

export function EmployeeDetailsDialog({ employee, isOpen, onClose, onSave, onDelete }) {
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (employee) {
      setEditedEmployee(employee);
      setIsChanged(false);
    }
  }, [employee]);

  const handleInputChange = ({ target: { name, value } }) => {
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSelectChange = (name, value) => {
    setEditedEmployee((prev) => ({ ...prev, [name]: value }))
    setIsChanged(true)
  }

  const handleSave = () => {
    onSave(editedEmployee);
    setIsChanged(false);
  }

  const handleDelete = () => {
    onDelete(editedEmployee._id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

  if (!editedEmployee) return null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Chi tiết nhân viên</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Image */}
          <div className="flex justify-center items-start md:col-span-1">
            <img
              src={editedEmployee.imageUrl || "/default-avatar.jpg"}
              alt={`Ảnh của ${editedEmployee.name}`}
              className="w-full max-w-[200px] h-auto rounded-lg object-cover"
            />
          </div>

          {/* Employee Details Form */}
          <div className="md:col-span-2 space-y-4">
            {fields.map(({ label, name, type, options, format }) => (
              <div key={name} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={name} className="text-right">
                  {label}:
                </Label>
                {type === 'select' ? (
                  <Select
                    name={name}
                    value={editedEmployee[name]}
                    onValueChange={(value) => handleSelectChange(name, value)}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={format ? format(editedEmployee[name]) : editedEmployee[name] || ""}
                    onChange={handleInputChange}
                    className="col-span-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Xóa nhân viên
          </Button>
          <Button type="button" onClick={handleSave} disabled={!isChanged}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ----- Alert Dialog Delete ----- */}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn xóa nhân viên này?</AlertDialogTitle>
          <AlertDialogDescription>Hành động này không thể hoàn tác. Nhân viên này sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
