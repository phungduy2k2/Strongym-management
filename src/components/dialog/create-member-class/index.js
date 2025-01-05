"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dialogMessages } from "@/utils/message";
import { useEffect, useRef, useState } from "react";

export default function CreateMemberClassDialog({
  isOpen,
  onClose,
  onRegister,
  members,
  classes,
}) {
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [isMemberSelectOpen, setIsMemberSelectOpen] = useState(false)
  const [isClassSelectOpen, setIsClassSelectOpen] = useState(false)
  const memberSearchRef = useRef(null);
  const classSearchRef = useRef(null);

  useEffect(() => {
    if (selectedClass) {
      const classInfo = classes.find((c) => c._id === selectedClass);
      if (classInfo) {
        setAmount(classInfo.price.toLocaleString("vi-VN"));
        setCurrency(classInfo.currency);
      }
    }
  }, [selectedClass, classes]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
    || member.phone.includes(memberSearch)
  );

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(classSearch.toLowerCase())
  );

  const handleCancel = () => {
    onClose()
    setSelectedMember("");
    setSelectedClass("");
    setAmount("");
    setCurrency("");
    setPaymentMethod("");
  }
  const handleRegister = () => {
    onRegister({
        member: members.find((member) => member._id === selectedMember),
        class: classes.find((cls) => cls._id === selectedClass),
        paymentMethod
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogMessages.memberClass.TITLE}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Member name */}
            <div>
              <Label htmlFor="member">
                {dialogMessages.memberClass.MEMBER_NAME}
              </Label>
              <Select
                onValueChange={setSelectedMember}
                value={selectedMember}
                open={isMemberSelectOpen}
                onOpenChange={(open) => {
                  setIsMemberSelectOpen(open)
                  if(open) {
                    setTimeout(() => memberSearchRef.current?.focus(), 0)
                  }
                }}
              >
                <SelectTrigger id="member">
                  <SelectValue
                    placeholder={dialogMessages.memberClass.MEMBER_PLC_HOLDER}
                  />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    ref={memberSearchRef}
                    placeholder="Tìm thành viên..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="mb-2"
                  />
                  <ScrollArea className="h-[200px]">
                    {filteredMembers.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name} - {member.phone}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Class name */}
            <div>
              <Label htmlFor="class">
                {dialogMessages.memberClass.CLASS_NAME}
              </Label>
              <Select
                onValueChange={setSelectedClass}
                value={selectedClass}
                open={isClassSelectOpen}
                onOpenChange={(open) => {
                  setIsClassSelectOpen(open)
                  if(open) {
                    setTimeout(() => classSearchRef.current?.focus(), 0)
                  }
                }}
              >
                <SelectTrigger id="class">
                  <SelectValue
                    placeholder={dialogMessages.memberClass.CLASS_PLC_HOLDERL}
                  />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    placeholder="Tìm lớp..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="mb-2"
                  />
                  <ScrollArea className="h-[200px]">
                    {filteredClasses.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name} - {cls.status}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment */}
          <div>
            <Label>{dialogMessages.memberClass.PAYMENT}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount">
                  {dialogMessages.memberClass.AMOUNT}
                </Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={currency} readOnly />
              </div>
              <div>
                <Label htmlFor="paymentMethod">
                  {dialogMessages.memberClass.METHOD}
                </Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue
                      placeholder={dialogMessages.memberClass.METHOD_PLC_HOLDER}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="card">Thẻ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
            <Button onClick={handleCancel}>{dialogMessages.memberClass.CANCEL}</Button>
            <Button onClick={handleRegister}
              className="bg-gradient-to-b from-green-500 to-green-600 text-white shadow hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 ease-in-out"
            >{dialogMessages.memberClass.REGISTER}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
