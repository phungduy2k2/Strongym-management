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
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const defaultData = {
  name: "",
  quantity: "",
  nextMaintenanceDate: "",
};

export function EquipmentDialog({ isOpen, onClose, onSave, onDelete, equipment: initialData }) {
  const [formData, setFormData] = useState(initialData || defaultData);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        quantity: initialData.quantity.toString(),
      } || defaultData);
    }
    setIsChanged(false);
  }, [initialData]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const handleSave = () => {
    onSave({
        ...formData,
        quantity: parseInt(formData.quantity, 10)
    })
    onClose()
  }

  const handleDelete = () => {
    onDelete(formData._id)
    setFormData(defaultData)
    onClose()
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chi tiết thiết bị" : "Thêm thiết bị"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {dialogMessages.eqm.NAME}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              {dialogMessages.eqm.QUANTITY}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nextMaintenanceDate" className="text-right">
              {dialogMessages.eqm.NEXT_MAINTENANCE}
            </Label>
            <Input
              id="nextMaintenanceDate"
              name="nextMaintenanceDate"
              type="date"
              value={formData.nextMaintenanceDate ? format(new Date(formData.nextMaintenanceDate), "yyyy-MM-dd") : ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          {initialData ? (
            <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              {dialogMessages.eqm.DELETE}
            </Button>
          ) : (
            <Button type="button" onClick={() => {onClose(); setFormData(defaultData)}}>
              {dialogMessages.eqm.CANCEL}
            </Button>
          )}
          <Button type="button" onClick={handleSave} disabled={!isChanged}>
            {dialogMessages.eqm.SAVE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ----- Alert Dialog Delete ----- */}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn xóa thiết bị này?</AlertDialogTitle>
          <AlertDialogDescription>Hành động này không thể hoàn tác. Bản ghi này sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
