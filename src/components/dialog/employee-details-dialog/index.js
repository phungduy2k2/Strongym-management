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

export function EmployeeDetailsDialog({ employee, isOpen, onClose, onSave }) {

  const [editedEmployee, setEditedEmployee] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (employee) {
      setEditedEmployee(employee);
      setIsChanged(false);
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
  };

  if (!editedEmployee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Chi tiết nhân viên</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center items-start md:col-span-1">
            <img
              src={editedEmployee.imageUrl || "/default-avatar.jpg"}
              alt={`Ảnh của ${editedEmployee.name}`}
              className="w-full max-w-[200px] h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Họ và tên:
              </Label>
              <Input
                id="name"
                name="name"
                value={editedEmployee.name}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="birth" className="text-right">
                Ngày sinh:
              </Label>
              <Input
                id="birth"
                name="birth"
                type="date"
                value={format(new Date(editedEmployee.birth), "yyyy-MM-dd")}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Giới tính:
              </Label>
              <Select
                name="gender"
                value={editedEmployee.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại:
              </Label>
              <Input
                id="phone"
                name="phone"
                value={editedEmployee.phone}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="idCard" className="text-right">
                CCCD/CMT:
              </Label>
              <Input
                id="idCard"
                name="idCard"
                value={editedEmployee.idCard}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Vị trí:
              </Label>
              <Input
                id="position"
                name="position"
                value={editedEmployee.position}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Địa chỉ:
              </Label>
              <Input
                id="address"
                name="address"
                value={editedEmployee.address}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            
            
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={!isChanged}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
