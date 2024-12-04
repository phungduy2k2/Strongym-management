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
import { useState } from "react";

export function AddMemberModal({ plans, isOpen, onClose, onSave }) {
  const defaultData = {
    imageUrl: "",
    name: "",
    birth: "",
    gender: "",
    phone: "",
    address: "",
    membershipPlanId: "",
    expiredDate: "",
    status: "active"
  }
  
  const [memberData, setMemberData] = useState(defaultData);

  const handleInputChange = ({ target: { name, value } }) => {
    setMemberData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setMemberData(prev => ({ ...prev, [name]: value }))
  }

  async function handleImageModal(event) {
    const extractImageUrl = await uploadImageToFirebase(event.target.files[0]);
    
    if (extractImageUrl !== "") {
      console.log(extractImageUrl, 'extractImage modal');
      
      setMemberData({
        ...memberData,
        imageUrl: extractImageUrl,
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(memberData)
    setMemberData(defaultData)
    // onClose()
  }

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
            />
          </div>
          <div>
            <Label htmlFor="name">{modalMessages.addMember.NAME}</Label>
            <Input
              id="name"
              name="name"
              value={memberData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="birth">{modalMessages.addMember.BIRTH}</Label>
            <Input
              id="birth"
              name="birth"
              type="date"
              value={memberData.birth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">{modalMessages.addMember.GENDER}</Label>
            <Select
              name="gender"
              value={memberData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={modalMessages.addMember.GENDER_PLACEHOLDER}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="phone">{modalMessages.addMember.PHONE}</Label>
            <Input
              id="phone"
              name="phone"
              value={memberData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">{modalMessages.addMember.ADDRESS}</Label>
            <Input
              id="address"
              name="address"
              value={memberData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="membershipPlanId">
              {modalMessages.addMember.MEMBERSHIP_PLAN}
            </Label>
            <Select
              name="membershipPlanId"
              value={memberData.membershipPlanId}
              onValueChange={(value) =>
                handleSelectChange("membershipPlanId", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={modalMessages.addMember.MEMBERSHIP_PLACEHOLDER}
                />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expiredDate">
              {modalMessages.addMember.EXPIRED_DATE}
            </Label>
            <Input
              id="expiredDate"
              name="expiredDate"
              type="date"
              value={memberData.expiredDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">
              {modalMessages.addMember.STATUS}
            </Label>
            <Select
              name="status"
              defaultValue="active"
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={modalMessages.addMember.STATUS_PLACEHOLDER}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* ----- footer ----- */}
          <Button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out">
                {modalMessages.addMember.SAVE}
          </Button>
        </form>
      </div>
    </div>
  );
}
