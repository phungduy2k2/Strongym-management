"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const initialFormData = {
  name: "",
  price: "",
  duration: "",
  description: "",
  total_member: 0,
};

export default function AdminMembershipDetailModal({ plan, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormEdited, setIsFormEdited] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        duration: plan.duration.toString(),
        description: plan.description
      });
    } else {
      setFormData(initialFormData);
    }
    setIsFormEdited(false)
  }, [plan]);

  useEffect(() => {
    const isValid =
      formData.name !== "" &&
      formData.price !== "" &&
      !isNaN(parseFloat(formData.price)) &&
      formData.duration !== "" &&
      !isNaN(parseInt(formData.duration)) &&
      formData.description !== "";
    setIsFormValid(isValid)
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormEdited(true)
  };

  const handleSave = () => {
    if(isFormValid){
      onSave({
        ...plan,
        name: formData.name,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description,
        total_member: formData.total_member
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (plan?._id && onDelete) {
      onDelete(plan._id);
      onClose();
    }
  };

  const isSaveDisabled = (plan && !isFormEdited) || !isFormValid

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md h-full p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {plan ? "Chi tiết gói tập" : "Thêm gói tập"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:trext-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Tên gói tập</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Giá (/người, đơn vị: đồng)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Thời gian hiệu lực (tháng)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  rows={6}
                  onChange={handleChange}
                  required
                />
              </div>
              {plan && (
                <div>
                  <Label>Số thành viên đăng ký</Label>
                  <p className="text-gray-600">{plan.total_member || 0}</p>
                </div>
              )}
              <div className="flex justify-between">
                <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
                  Lưu
                </Button>
                {plan && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
