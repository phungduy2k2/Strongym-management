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

export function MemberDetailsDialog({ member, plans, isOpen, onClose, onSave, onDelete }) {
  const [editedMember, setEditedMember] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if(member) {
      setEditedMember(member);
      setIsChanged(false);
    }
  }, [member]);

  const handleInputChange = ({ target: { name, value } }) => {
    setEditedMember((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSelectChange = (name, value) => {
    setEditedMember((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedMember);
    setIsChanged(false);
  };

  const confirmDelete = async () => {
    await onDelete(editedMember._id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

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
    { label: "Địa chỉ", name: "address", type: "text" },
    {
      label: "Gói tập đăng ký",
      name: "membershipPlanId",
      type: "select",
      options: plans.map(plan => ({ value: plan._id, label: plan.name })),
    },
    {
      label: "Ngày đăng ký",
      name: "createdAt",
      type: "date",
      format: (value) => format(new Date(value), "yyyy-MM-dd"),
    },
    {
      label: "Ngày kết thúc",
      name: "expiredDate",
      type: "date",
      format: (value) => format(new Date(value), "yyyy-MM-dd"),
    },
    {
      label: "Trạng thái",
      name: "status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
      ],
    },
  ]

  if (!editedMember) return null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Chi tiết thành viên</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Member Image */}
            <div className="flex justify-center items-start md:col-span-1">
              <img
                src={editedMember.imageUrl || "/default-avatar.jpg"}
                alt={`Ảnh của ${editedMember.name}`}
                className="w-full max-w-[200px] h-auto rounded-lg object-cover"
              />
            </div>

            {/* Member Details Form */}
            <div className="md:col-span-2 space-y-4">
              {fields.map(({ label, name, type, options, format }) => (
                <div key={name} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={name} className="text-right">
                    {label}:
                  </Label>
                  {type === 'select' ? (
                    name !== "membershipPlanId" ? (
                      <Select
                        name={name}
                        value={editedMember[name] !== null ? editedMember[name].toString() : ""}
                        onValueChange={(value) => handleSelectChange(name, value)}
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        name={name}
                        defaultValue={editedMember[name]?._id}
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
                    )
                  ) : (
                    <Input
                      id={name}
                      name={name}
                      type={type}
                      value={format ? format(editedMember[name]) : editedMember[name] || ""}
                      onChange={handleInputChange}
                      className="col-span-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="mt-4">
            <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Xóa thành viên
            </Button>
            <Button type="submit" disabled={!isChanged}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* ----- Alert Dialog Delete ----- */}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn xóa thành viên này?</AlertDialogTitle>
          <AlertDialogDescription>Hành động này không thể hoàn tác. Thành viên này sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
