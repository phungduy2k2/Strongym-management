"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { uploadImageToFirebase } from "@/utils";

export function AdminClassDialog({ isOpen, onClose, onSave, onDelete, classData: initialClassData, trainerData }) {
  const defaultData = {
    name: "",
    imageUrl: null,
    trainerId: { _id: "", name: "" },
    price: "",
    currency: "",
    description: "",
    status: "UPCOMING",
    startDate: "",
    endDate: "",
  }
  const [classData, setClassData] = useState(initialClassData || defaultData);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if(initialClassData){
      setClassData({
        ...initialClassData,
        startDate: initialClassData.startDate ? format(new Date(initialClassData.startDate), 'yyyy-MM-dd') : '',
        endDate: initialClassData.endDate ? format(new Date(initialClassData.endDate), 'yyyy-MM-dd') : '',
      } || defaultData)
    }
    setIsChanged(false);
  }, [initialClassData])

  const handleInputChange = ({ target: { name, value } }) => {
    setClassData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true)
  };

  const handleSelectChange = (name, value) => {
    setClassData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true)
  };

  async function handleImageUpload(e) {
    const extractImageUrl = await uploadImageToFirebase(e.target.files[0]);
    if (extractImageUrl !== "") {
      setClassData({
        ...classData,
        imageUrl: extractImageUrl,
      });
      setIsChanged(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(classData._id, classData);
    setIsChanged(false)
    onClose();
  };

  const confirmDelete = () => {
    onDelete(classData._id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

  return (
  <>  
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {/* ----- Header ----- */}
        <DialogHeader>
          <DialogTitle>{initialClassData ? dialogMessages.class.DETAILS_TITLE : dialogMessages.class.ADD_TITLE}</DialogTitle>
        </DialogHeader>

        {/* ----- Body ----- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/3 mt-6">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-40 w-40 flex items-center justify-center">
                  {classData.imageUrl ? (
                    <img
                      src={classData.imageUrl}
                      alt="Ảnh minh họa"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-5xl text-gray-400">+</span>
                  )}
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="w-2/3 space-y-4">
              <div>
                <Label htmlFor="name">{dialogMessages.class.NAME}</Label>
                <Input
                  id="name"
                  name="name"
                  value={classData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="trainerId">{dialogMessages.class.TRAINER}</Label>
                <Select
                  name="trainerId"
                  defaultValue={classData.trainerId._id}
                  onValueChange={(value) => handleSelectChange("trainerId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giáo viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainerData.length && trainerData.map((trainer) => (
                      <SelectItem
                        key={trainer._id}
                        value={trainer._id}
                      >
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="price">{dialogMessages.class.PRICE}</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={classData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="currency">{dialogMessages.class.CURRENCY}</Label>
                  <Select
                    name="currency"
                    defaultValue={classData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="VND" value="VND">VND</SelectItem>
                      <SelectItem key="USD" value="USD">USD</SelectItem>
                      <SelectItem key="EUR" value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="description">
              {dialogMessages.class.DESCRIPTION}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={classData.description}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="startDate">
                {dialogMessages.class.START_DATE}
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={classData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="endDate">{dialogMessages.class.END_DATE}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={classData.endDate}
                onChange={handleInputChange}
                required
                min={classData.startDate}
              />
            </div>
          </div>

          {/* ----- Footer ----- */}
          <DialogFooter>
            {initialClassData && (
              <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                {dialogMessages.class.DELETE_BUTTON}
              </Button>
            )}
            <Button type="submit" disabled={!isChanged}>
              {initialClassData ? dialogMessages.class.SAVE_CHANGE : dialogMessages.class.SAVE_BUTTON}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    
    {/* ----- Alert Dialog Delete ----- */}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogMessages.class.ALERT_DIALOG_TITLE}</AlertDialogTitle>
          <AlertDialogDescription>{dialogMessages.class.ALERT_DIALOG_DESCRIPTION}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{dialogMessages.class.CANCEL}</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>{dialogMessages.class.DELETE}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>  
  );
}
