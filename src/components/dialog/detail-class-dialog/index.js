"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dialogMessages } from "@/utils/message";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { uploadImageToFirebase } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function DetailClassDialog({ isOpen, onClose, onSave, onDelete, classData: initialClassData, trainerData }) {
  const defaultData = {
    name: "",
    imageUrl: null,
    trainerId: trainerData,
    maxStudent: 1,
    memberIds: [],
    price: "",
    currency: "",
    description: "",
    status: "UPCOMING",
    approvalStatus: "PENDING",
    startDate: "",
    endDate: "",
    schedule: [],
  }
  const [classData, setClassData] = useState(initialClassData || defaultData);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSchedule, setNewSchedule] = useState({ date: null, startTime: '', endTime: '' })
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

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

  const filteredMembers = classData.memberIds.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  )

  const handleNewScheduleChange = (field, value) => {
    setNewSchedule(prev => ({ ...prev, [field]: value }))
  };
  const addSchedule = useCallback(() => {
    if (newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
      const newScheduleItem = {
        date: format(newSchedule.date, 'yyyy-MM-dd'),
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
      }
      setClassData(prev => ({
        ...prev,
        schedule: [...prev.schedule, newScheduleItem].sort((a, b) => new Date(a.date) - new Date(b.date))
      }))
      setNewSchedule({ date: null, startTime: '', endTime: '' })
      setIsAddingSchedule(false)
      setIsChanged(true)
    }
  }, [newSchedule])
  const deleteSchedule = useCallback((index) => {
    setClassData(prev => ({
      ...prev, schedule: prev.schedule.filter((_, i) => i !== index)
    }))
    setIsChanged(true)
  }, [])

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
    console.log(classData, 'classDate before save');
    
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
      <DialogContent className="sm:max-w-[600px] max-h-[100vh] flex flex-col">
        {/* ----- Header ----- */}
        <DialogHeader>
          <DialogTitle>{initialClassData ? dialogMessages.class.DETAILS_TITLE : dialogMessages.class.ADD_TITLE}</DialogTitle>
        </DialogHeader>

        {/* ----- Body ----- */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1 mb-3">
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
              {initialClassData && classData.approvalStatus === "ACCEPTED" ? (
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <Label htmlFor="maxStudent">{dialogMessages.class.NUMBER}</Label>
                    <Input
                      id="maxStudent"
                      name="maxStudent"
                      type="number"
                      min="1"
                      value={classData.maxStudent}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-2/3">
                    <Label>{dialogMessages.class.LIST_MEMBERS}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          Số lượng: {classData.memberIds.length}/{classData.maxStudent}
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
                              <div key={index} className="p-2 text-md hover:bg-muted/50 rounded-md transition-colors">
                                {member.name} - {member.phone}
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ) : (
                <div className="w-1/3">
                    <Label htmlFor="maxStudent">{dialogMessages.class.NUMBER}</Label>
                    <Input
                      id="maxStudent"
                      name="maxStudent"
                      type="number"
                      min="1"
                      value={classData.maxStudent}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="description">{dialogMessages.class.DESCRIPTION}</Label>
            <Textarea
              id="description"
              name="description"
              value={classData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="startDate">{dialogMessages.class.START_DATE}</Label>
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

          {/* SCHEDULE */}
          <div>
            <div className="flex items-center">
              <Label htmlFor="schedule">{dialogMessages.class.SCHEDULE}</Label>
              <Button type="button" variant="outline" size="sm" className="ml-3"
                onClick={() => setIsAddingSchedule(true)}>
                <Plus className="h-4 w-4"/>
              </Button>
            </div>
            <div className="overflow-x-auto mt-2">
              <div className="flex space-x-2">
                {classData.schedule.map((item, index) => (
                  <div key={index} className="flex-shrink-0 bg-gray-100 p-2 rounded flex items-center">
                    <span>{new Date(item.date).toLocaleDateString()} {item.startTime} - {item.endTime}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => deleteSchedule(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {isAddingSchedule && (
              <div className="mt-2 p-2 border rounded-md space-y-2">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                  <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {newSchedule.date ? format(newSchedule.date, "PPP") : <span>Chọn ngày</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSchedule.date}
                      onSelect={(date) => handleNewScheduleChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                  </Popover>
                  </div>

                  <div className="flex-1">
                    <Input
                      id="startTime"
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => handleNewScheduleChange("startTime", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      id="endTime"
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => handleNewScheduleChange("endTime", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingSchedule(false)}>
                    {dialogMessages.class.CANCEL}
                  </Button>
                  <Button type="button" onClick={addSchedule}>
                    {dialogMessages.class.ADD}
                  </Button>
                </div>
              </div>
            )}
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
