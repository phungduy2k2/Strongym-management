"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToFirebase } from "@/utils";
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const defaultData = {
  title: "",
  banner: "",
  description: "",
  startDate: "",
  endDate: "",
};

export default function EventDialog({ isOpen, onClose, event: initialEvent, onSave, onDelete }) {
  const [formData, setFormData] = useState(initialEvent || defaultData);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setFormData(initialEvent || defaultData);
    }
    setIsChanged(false);
  }, [initialEvent]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  async function handleImageModal(event) {
    const extractImageUrl = await uploadImageToFirebase(event.target.files[0]);
    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        banner: extractImageUrl,
      });
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    onDelete(formData._id)
    setFormData(defaultData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialEvent ? "Chi tiết sự kiện" : "Thêm sự kiện"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="flex justify-center">
            <Label htmlFor="banner" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-400 rounded-lg h-40 w-auto min-w-40 flex items-center justify-center">
                {formData.banner ? (
                  <img
                    src={formData.banner}
                    alt="Ảnh minh họa"
                    className="h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-5xl text-gray-400">+</span>
                )}
              </div>
            </Label>
            <Input
              id="banner"
              name="banner"
              accept="image/*"
              type="file"
              className="hidden"
              onChange={handleImageModal}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">{dialogMessages.event.TITLE}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">{dialogMessages.event.DESCRIPTION}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="startDate">{dialogMessages.event.START_DATE}</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate ? format(new Date(formData.startDate), "yyyy-MM-dd") : ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">{dialogMessages.event.END_DATE}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate ? format(new Date(formData.endDate), "yyyy-MM-dd") : ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            {initialEvent ? (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    {dialogMessages.event.DELETE}
                </Button>
            ) : (
                <Button type="button" onClick={() => {onClose(); setFormData(defaultData)}}>
                    {dialogMessages.event.CANCEL}
                </Button>
            )}
            <Button type="button" onClick={handleSave} disabled={!isChanged}
              className="bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
            >
                {dialogMessages.event.SAVE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
