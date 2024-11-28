"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export function MemberDetailsDialog({ member, isOpen, onClose, onSave }) {
  const [editedMember, setEditedMember] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (member) {
      setEditedMember(member);
      setIsChanged(false);
    }
  }, [member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMember((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSelectChange = (name, value) => {
    setEditedMember((prev) => ({ ...prev, [name]: value }))
    setIsChanged(true)
  }

  const handleSave = () => {
    onSave(editedMember);
    setIsChanged(false);
  };

  if (!editedMember) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Chi tiết thành viên</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center items-start md:col-span-1">
            <img
              src={editedMember.image || "/default-avatar.jpg"}
              alt={`Ảnh của ${editedMember.name}`}
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
                value={editedMember.name}
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
                value={format(new Date(editedMember.birth), "yyyy-MM-dd")}
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
                value={editedMember.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
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
                value={editedMember.phone}
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
                value={editedMember.address}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="membershipPlanId" className="text-right">
                Gói tập đăng ký:
              </Label>
              <Input
                id="membershipPlanId"
                name="membershipPlanId"
                value={editedMember.membershipPlanId}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="registrationDate" className="text-right">
                Ngày đăng ký:
              </Label>
              <Input
                id="registrationDate"
                name="registrationDate"
                type="date"
                // value={format(new Date(editedMember.registrationDate), "dd-MM-yyyy")}
                value={editedMember.registrationDate}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Ngày kết thúc:
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                // value={format(new Date(editedMember.endDate), "yyyy-MM-dd")}
                value={editedMember.endDate}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái:
              </Label>
              <Input
                id="status"
                name="status"
                value={editedMember.status}
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
