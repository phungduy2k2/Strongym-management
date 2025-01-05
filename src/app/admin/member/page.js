"use client";

import MemberTable from "@/components/table/member-table";
import { useEffect, useState } from "react";
import { showToast } from "@/utils";
import Notification from "@/components/Notification";
import { createMember, deleteMember, getMembers, updateMember } from "@/services/member";
import { AddMemberModal } from "@/components/modal/add-member-modal";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { addMemberIntoPlan, getAllPlans } from "@/services/membershipPlan";
import { HashLoader } from "react-spinners";
import { createClerkAccount, createUser } from "@/services/user";
import { createPayment } from "@/services/payment";

export default function MemberPage() {
  const [members, setMembers] = useState([]);
  const [allPlans, setAllPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMembers(), fetchPlans()]);
    };
    fetchData();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await getMembers();
      if (response.success) {
        setMembers(response.data);
      } else {
        showToast("error", response.message);
      }      
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin thành viên.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await getAllPlans();
      if (res.success) {
        setAllPlans(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", res.message || "Không lấy được dữ liệu gói tập.")
    }
  }

  const handleAddMember = async (newMember) => {
    try {
      const res = await createMember(newMember);      
      if (res.success) {
        setMembers(prevMembers => [...prevMembers, res.data])
        showToast("success", res.message);
        setIsAddModalOpen(false);
        return res;
      } else {
        showToast("error", res.message)
        return res;
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi thêm thành viên.")
    }
  }

  // Tạo tài khoản Clerk
  const handleCreateClerk = async (clerkData) => {
    try {
      const res = await createClerkAccount(clerkData)
      if (res.success) {
        showToast("success", res.message);
        return res;
      } else {
        showToast("error", res.message)
        return res;
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi tạo tài khoản Clerk.")
    }
  }

  // Cập nhật total_member của gói tập tăng thêm 1
  const handleAddMemberIntoPlan = async (planId) => {
    try {
      const res = await addMemberIntoPlan(planId);
      if (res.success) {
        showToast("success", res.message)
        return res;
      } else {
        showToast("error", res.message)
        return res;
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi tăng giá trị tổng thành viên của gói tập.")
    }
  }

  // Tạo bản ghi Payment cho thanh toán gói tập
  const handleCreatePayment = async (paymentData) => {
    try {
      const res = await createPayment(paymentData)      
      if (res.success) {
        showToast("success", res.message)
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra tạo khoản thanh toán.")
    }
  }

  // Hành động sau khi ấn nút LƯU
  const handleSaveNewMember = async (newMember) => {
    const {email, paymentMethod, ...memberData} = newMember;
    
    const clerkData = {
      username: newMember.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, "_"),
      email: email,
      role: "member"
    }

    const [addMemberRes, createClerkRes] = await Promise.all([
      handleAddMember(memberData),
      handleCreateClerk(clerkData)
    ])
    
    // Tạo bản ghi User (liên kết với bản ghi Member và tài khoản Clerk)
    try {
      const newUserData = {
        userId: createClerkRes.data.id,
        username: clerkData.username,
        email: email,
        memberId: addMemberRes.data._id,
        role: clerkData.role
      }
      const res = await createUser(newUserData);
      if(res.success) {
        showToast("success", res.message)
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi thêm bản ghi User.")
    }

    const updatePlanRes = await handleAddMemberIntoPlan(addMemberRes.data.membershipPlanId)

    const paymentData = {
      customer: addMemberRes.data.name,
      memberId: addMemberRes.data._id,
      membershipPlanId: addMemberRes.data.membershipPlanId,
      amount: updatePlanRes.data.price,
      currency: "VND",
      description: `Thanh toán cho ${updatePlanRes.data.name}`,
      paymentMethod: paymentMethod
    }
    await handleCreatePayment(paymentData);
  }

  const handleUpdateMember = async (id, updatedMember) => {
    try {
      const res = await updateMember(id, updatedMember);
      if (res.success) {
        setMembers(prevMembers =>
          prevMembers.map(member => member._id === id ? res.data : member));
        showToast("success", res.message)
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred while updating the member")
    }
  }

  const handleDeleteMember = async (id) => {
    try {
      const res = await deleteMember(id);
      if (res.success) {
        setMembers(prevMembers => prevMembers.filter(member => member._id !== id))
        showToast("success", res.message)
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred while deleting the member")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="min-w-screen mb-6 flex justify-between items-center">
        <span className="text-3xl font-bold">Quản lý thành viên</span>
        {/* ----- Button "Thêm" ----- */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm thành viên
          <CirclePlus/>
        </Button>
      </div>

      {/* ----- Members Table ----- */}
      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader
            loading={isLoading}
            color="#1e293b"
            size={50}
          />
        </div>
      ) : (
        <MemberTable
          members={members}
          plans={allPlans}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />
      )}

      {/* ----- Add New Member Modal -----  */}
      <AddMemberModal
        plans={allPlans}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewMember}
      />
      <Notification />
    </div>
  );
}
