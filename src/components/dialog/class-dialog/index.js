"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useState } from "react";

const defaultClass ={
    name: "",
    imageUrl: null,
    trainerId: { _id: "", name: "" },
    price: 0,
    currency: "",
    description: "",
    status: "",
    startDate: "",
    endDate: ""
}
export default function ClassDialog({ isOpen, onClose, register, class: selectedClass }) {
  const [classData, setClassData] = useState(selectedClass || defaultClass);

  const handleRegister = () => {
    register(classData)
  }

  return (
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
                <Label htmlFor="name" className="text-2xl">{classData.name}</Label>
              </div>
              <div>
                <Label htmlFor="trainerId">{dialogMessages.class.TRAINER}: </Label>
                <Label className="text-xl">{classData.trainerId.name}</Label>
              </div>
              <div>
                <Label>{dialogMessages.class.PRICE}: </Label>
                <Label className="text-xl">{classData.price.toLocaleString("vi-VN")} {classData.currency}</Label>
              </div>
            </div>
          </div>

          <div className="border-2 rounded-lg p-1">
            <Label>{dialogMessages.class.DESCRIPTION}:</Label>
            <div className="prose whitespace-pre-wrap">{classData.description}</div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Label>{dialogMessages.class.START_DATE}: </Label>
              <span>{classData.startDate ? format(new Date(classData.startDate), "dd-MM-yyyy") : null}</span>
            </div>
            <div className="w-1/2">
              <Label>{dialogMessages.class.END_DATE}: </Label>
              <span>{classData.endDate ? format(new Date(classData.endDate), "dd-MM-yyyy") : null}</span>
            </div>
          </div>
        </div>

        {/* ----- Footer ----- */}
        <DialogFooter>
          <Button type="button" onClick={handleRegister}
            className="bg-gradient-to-b from-green-500 to-green-600 text-white shadow hover:from-green-600 hover:to-green-700 hover:text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out">
            {dialogMessages.class.REGISTER_BUTTON}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
