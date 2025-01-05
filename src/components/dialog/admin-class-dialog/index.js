"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const defaultClass = {
  name: "",
  imageUrl: null,
  trainerId: { _id: "", name: "" },
  memberIds: [],
  price: 0,
  currency: "",
  description: "",
  status: "",
  approvalStatus: "",
  startDate: "",
  endDate: "",
};
export default function AdminClassDialog({
  isOpen,
  onClose,
  class: selectedClass,
  onAccept,
  onReject,
}) {
  const [classData, setClassData] = useState(selectedClass || defaultClass);
  const [searchTerm, setSearchTerm] = useState("");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const filteredMembers = classData.memberIds.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm)
  );

  const handleAccept = () => {
    onAccept(classData._id);
  };

  const handleReject = () => {
    onReject(classData._id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          {/* ----- Header ----- */}
          <DialogHeader>
            <DialogTitle>{dialogMessages.class.DETAILS_TITLE}</DialogTitle>
          </DialogHeader>

          {/* ----- Body ----- */}
          <div className="space-y-4">
            <div className="flex mt-6 gap-4">
              <div className="w-1/3">
                <div className="rounded-lg h-40 w-40 flex items-center justify-center">
                  <img
                    src={classData?.imageUrl || "/icons/class-icon.png"}
                    alt="Ảnh minh họa"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="w-2/3 space-y-4">
                <div>
                  <Label htmlFor="name" className="text-2xl">
                    {classData.name}
                  </Label>
                </div>
                <div>
                  <Label htmlFor="trainerId">
                    {dialogMessages.class.TRAINER}:{" "}
                  </Label>
                  <Label className="text-xl">{classData.trainerId.name}</Label>
                </div>
                <div>
                  <Label>{dialogMessages.class.PRICE}: </Label>
                  <Label className="text-xl">
                    {classData.price.toLocaleString("vi-VN")}{" "}
                    {classData.currency}
                  </Label>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-1/4">
                    <Label>{dialogMessages.class.NUMBER}: </Label>
                    <Label className="text-md">{classData.maxStudent}</Label>
                  </div>
                  {(classData.approvalStatus === "ACCEPTED") &&
                  (
                    <div className="w-3/4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            DS học viên: {classData.memberIds.length}/{classData.maxStudent}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-100 bg-gray-200">
                          <div className="space-y-1">
                            <Input
                              className="bg-white"
                              type="text"
                              placeholder="Tìm học viên theo tên/sđt..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="max-h-[200px] overflow-y-auto">
                              {filteredMembers.map((member, index) => (
                                <div key={index}
                                  className="p-2 text-md hover:bg-muted/50 rounded-md transition-colors"
                                >
                                  {member.name} - {member.phone}
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-2 rounded-lg p-1">
              <Label>{dialogMessages.class.DESCRIPTION}:</Label>
              <div className="prose whitespace-pre-wrap overflow-y-auto max-h-[6rem]">
                {classData.description}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label>{dialogMessages.class.START_DATE}: </Label>
                <span>
                  {classData.startDate
                    ? format(new Date(classData.startDate), "dd-MM-yyyy")
                    : null}
                </span>
              </div>
              <div className="w-1/2">
                <Label>{dialogMessages.class.END_DATE}: </Label>
                <span>
                  {classData.endDate
                    ? format(new Date(classData.endDate), "dd-MM-yyyy")
                    : null}
                </span>
              </div>
            </div>

            <div>
              <Label>{dialogMessages.class.SCHEDULE}:</Label>
              <div className="overflow-x-auto mt-2">
                <div className="flex space-x-2">
                  {classData.schedule?.map((item, index) => (
                    <div key={index} className="flex-shrink-0 bg-gray-100 p-2 rounded flex items-center">
                      <span>{new Date(item.date).toLocaleDateString()} {item.startTime} - {item.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ----- Footer ----- */}
          <DialogFooter>
            {classData.approvalStatus === "PENDING" ? (
              <>
                <Button
                  type="button"
                  onClick={() => setAcceptDialogOpen(true)}
                  className="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow"
                >
                  {dialogMessages.class.ACCEPT}
                </Button>
                <Button
                  type="button"
                  onClick={() => setRejectDialogOpen(true)}
                  variant="destructive"
                >
                  {dialogMessages.class.REJECT}
                </Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----- Alert Dialog Accept ----- */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đồng ý chấp nhận lớp học này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ----- Alert Dialog Reject ----- */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn xác nhận từ chối lớp học này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
