"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImageToFirebase } from "@/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddEmployeeModal({ isOpen, onClose, onSave }) {
  const defaultData = {
    imageUrl: "",
    name: "",
    birth: "",
    gender: null,
    idCard: "",
    phone: "",
    address: "",
    position: "",
  };

  const [empData, setEmpData] = useState(defaultData);

  useEffect(() => {
    setEmpData(defaultData)
  }, [isOpen])
  
  const handleInputChange = ({ target: { name, value } }) => {
    setEmpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setEmpData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleImageModal(event) {
    const extractImageUrl = await uploadImageToFirebase(event.target.files[0]);
    if (extractImageUrl !== "") {
      setEmpData({
        ...empData,
        imageUrl: extractImageUrl,
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(empData);
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
    {
      label: "CCCD/CMND",
      name: "idCard",
      type: "text",
    },
    { label: "Số điện thoại", name: "phone", type: "text" },
    { label: "Địa chỉ", name: "address", type: "text" },
    {
      label: "Vị trí",
      name: "position",
      type: "select",
      options: [
        { value: "trainer", label: "Huấn luyện viên" },
        { value: "receptionist", label: "Lễ tân" },
        { value: "security", label: "Bảo vệ" },
        { value: "cleanor", label: "Nhân viên vệ sinh" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background shadow-lg shadow-black/50 p-6 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Thêm nhân viên mới</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* ----- form body ----- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <Label htmlFor="imageUrl" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-32 w-32 flex items-center justify-center">
                  {empData.imageUrl ? (
                    <img
                      src={empData.imageUrl}
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

            {fields.map(({ label, name, type, options, format }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                {type === "select" ? (
                  <Select
                    name={name}
                    value={
                      empData[name] !== null ? empData[name].toString() : ""
                    }
                    onValueChange={(value) => handleSelectChange(name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Chọn ${label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
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
                    value={empData[name]}
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
              Lưu thành viên
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
