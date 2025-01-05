"use client";

import AdminMembershipDetailModal from "@/components/modal/admin-membership-detail-modal";
import Notification from "@/components/Notification";
import { Button } from "@/components/ui/button";
import {
  addNewPlan,
  deletePlan,
  getAllPlans,
  updatePlan,
} from "@/services/membershipPlan";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function AdminMembershipPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi lấy thông tin các gói tập.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = () => {
    setSelectedPlan(undefined);
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    if (updatedPlan._id) { // update membershipPlan
      try {
        const response = await updatePlan(updatedPlan._id, updatedPlan);
        if (response.success) {
          setPlans((prevPlans) =>
            prevPlans.map((plan) =>
              plan._id === updatedPlan._id ? response.data : plan
            )
          );
          showToast("success", response.message);
        } else {
          showToast("error", response.message);
        }
      } catch (err) {
        showToast("error", "Có lỗi khi cập nhật gói tập.");
      }
    } else { // create new membershipPlan
      try {
        const response = await addNewPlan(updatedPlan);
        if (response.success) {
          setPlans((prevPlans) => [...prevPlans, response.data]);
          showToast("success", response.message);
        } else {
          showToast("error", response.message);
        }
      } catch (err) {
        showToast("error", err.message);
      }
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      const res = await deletePlan(id);
      if (res.success) {
        setPlans((prev) => prev.filter((p) => p._id !== id));
        showToast("success", res.message);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi xóa gói tập.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-3xl font-bold">Quản lý gói tập</h1>
        <div>
          <span className="mr-3 italic font-bold text-gray-600">
            Tổng: {plans.length} gói tập
          </span>
          <Button
            onClick={handleAddPlan}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm
            <CirclePlus />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="flex flex-col bg-gradient-to-b from-muted/50 to-muted/20 rounded-lg shadow-lg overflow-hidden w-full max-w-sm"
            >
              <div className="flex justify-center">
                <Image
                  src="/icons/plan-icon.png"
                  alt={plan.name}
                  height={150}
                  width={150}
                  objectFit="cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <span className="text-lg text-gray-600 font-semibold italic">
                    {plan.price.toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                <Button
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1 mt-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminMembershipDetailModal
        key={selectedPlan ? selectedPlan._id : "new"}
        isOpen={isModalOpen}
        plan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        onDelete={handleDeletePlan}
      />

      <Notification />
    </div>
  );
}
