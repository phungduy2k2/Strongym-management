"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImageToFirebase } from "@/utils";
import { modalMessages } from "@/utils/message";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function AddMemberModal({ plans, isOpen, onClose, onSave }) {
  const defaultData = {
    imageUrl: "",
    name: "",
    birth: "",
    gender: null,
    phone: "",
    address: "",
    email: "",
    membershipPlanId: "",
    paymentMethod: "",
    expiredDate: "",
    status: "active",
  };

  const [memberData, setMemberData] = useState(defaultData);

  useEffect(() => {
    setMemberData(defaultData)
  }, [isOpen])

  const handleInputChange = ({ target: { name, value } }) => {
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleImageModal(event) {
    const extractImageUrl = await uploadImageToFirebase(event.target.files[0]);
    if (extractImageUrl !== "") {
      setMemberData({
        ...memberData,
        imageUrl: extractImageUrl,
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(memberData);
  };

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
    { label: "Email", name: "email", type: "email" },
    {
      label: "Gói tập đăng ký",
      name: "membershipPlanId",
      type: "select",
      options: plans.map((plan) => ({ value: plan._id, label: plan.name })),
    },
    {
      label: "Phương thức thanh toán",
      name: "paymentMethod",
      type: "select",
      options: [
        { value: "cash", label: "Tiền mặt" },
        { value: "card", label: "Thẻ" }
      ]
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
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-background shadow-lg shadow-black/50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-2xl font-bold">
            {modalMessages.addMember.TITLE}
          </Label>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* ----- form body ----- */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-grow overflow-y-auto"
        >
          <div className="flex justify-center">
            <Label htmlFor="imageUrl" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-400 rounded-lg h-32 w-32 flex items-center justify-center">
                {memberData.imageUrl ? (
                  <img
                    src={memberData.imageUrl}
                    alt="Ảnh minh họa"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-5xl text-gray-400">+</span>
                )}
              </div>
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              accept="image/*"
              type="file"
              className="hidden"
              onChange={handleImageModal}
              required
            />
          </div>

          {/* Member Details Form */}
          {fields.map(({ label, name, type, options, format }) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              {type === "select" ? (
                <Select
                  name={name}
                  value={memberData[name] !== null ? memberData[name].toString() : ""}
                  onValueChange={(value) => handleSelectChange(name, value)}
                >
                  <SelectTrigger>
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
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={memberData[name]}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>
          ))}

          {/* ----- footer ----- */}
          <Button
            type="submit"
            className="w-full !mt-12 bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            {modalMessages.addMember.SAVE}
          </Button>
        </form>
      </div>
    </div>
  );
}
