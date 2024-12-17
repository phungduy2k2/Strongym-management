"use client";

import {
  initialMemberFormData,
  initialMemberFormControls,
  showToast,
  uploadImageToFirebase,
} from "@/utils";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { createMember } from "@/services/member";
import { createUser } from "@/services/user";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Notification from "../Notification";

export default function OnBoard({ user }) {
  const [formData, setFormData] = useState(initialMemberFormData);
  const router = useRouter()

  async function handleImageUpload(event) {
    const extractImageUrl = await uploadImageToFirebase(event.target.files[0]);
    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //tạo record Member rồi tạo record User
    try {
      const res = await createMember(formData);
      if (res.success) {
        const newMember = res.data;
        showToast("success", res.message);
        try {
          const response = await createUser({
            userId: user.id,
            username: user.username,
            email: user.emailAddresses[0]?.emailAddress,
            role: "member",
            memberId: newMember._id,
          });
          if (response.success) {
            showToast("success", response.message);
            router.push("/");
          } else {
            showToast("error", response.message);
          }
        } catch (err) {
          console.error(err);
          showToast("error", "Có lỗi khi tạo tài khoản mới.");
        }
      } else {
        console.error(res.message);
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi tạo thành viên mới.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg_onboard.jpg')" }}
    >
      <div className="bg-white bg-opacity-75 mt-16 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thông tin chi tiết
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <Label htmlFor="imageUrl" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-400 rounded-lg h-32 w-32 flex items-center justify-center">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
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
              onChange={handleImageUpload}
              required
            />
          </div>

          {initialMemberFormControls.map(
            ({ label, name, type, options, format }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                {type !== "radio" ? (
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <RadioGroup
                    name={name}
                    value={formData[name]}
                    onValueChange={(value) => handleRadioChange(name, value)}
                    required
                  >
                    {options.map((option) => (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label htmlFor={option.label}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )
          )}

          <Button
            type="submit"
            className="w-full !mt-12 bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Lưu thông tin
          </Button>
        </form>
      </div>
      <Notification />
    </div>
  );
}
