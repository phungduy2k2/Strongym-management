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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { firebaseConfig, firebaseStorageUrl } from "@/utils";
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageUrl);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
}

async function UploadImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `strongym/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}

export function MemberDetailsDialog({ member, plans, isOpen, onClose, onSave, onDelete }) {
  const [editedMember, setEditedMember] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    setEditedMember({
      ...member,
      birth: member?.birth ? format(new Date(member.birth), 'yyyy-MM-dd') : '',
      createdAt: member?.createdAt ? format(new Date(member.createdAt), 'yyyy-MM-dd') : '',
      expiredDate: member?.expiredDate ? format(new Date(member.expiredDate), 'yyyy-MM-dd') : '',
    });
    setIsChanged(false);
  }, [member]);

  const handleInputChange = ({ target: { name, value } }) => {
    setEditedMember((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSelectChange = (name, value) => {
    setEditedMember((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  async function handleImage(e) {
    console.log(e.target, 'event target');
    
    const extractImageUrl = await UploadImageToFirebase(e.target.files[0]);
    
    if (extractImageUrl !== "") {
      console.log(extractImageUrl, 'extractImage member');
      
      setEditedMember({
        ...editedMember,
        imageUrl: extractImageUrl,
      });
      setIsChanged(true);
    }
  }

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
            <div className="flex justify-center items-start md:col-span-1">
              <img
                src={editedMember.imageUrl || "/default-avatar.jpg"}
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
                  value={editedMember.birth}
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
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
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
                <Select
                  name="membershipPlanId"
                  defaultValue={editedMember.membershipPlanId?._id}
                  onValueChange={(value) =>
                    handleSelectChange("membershipPlanId", value)
                  }
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue
                      placeholder="Chọn gói tập"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan._id} value={plan._id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="createdAt" className="text-right">
                  Ngày đăng ký:
                </Label>
                <Input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={editedMember.createdAt}
                  onChange={handleInputChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="expiredDate" className="text-right">
                  Ngày kết thúc:
                </Label>
                <Input
                  id="expiredDate"
                  name="expiredDate"
                  type="date"
                  defaultValue={editedMember.expiredDate}
                  onChange={handleInputChange}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái:
                </Label>
                <Select
                  name="status"
                  value={editedMember.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

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
