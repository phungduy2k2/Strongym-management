"use client";

import MemberTable from "@/components/table/member-table";
import { useEffect, useState } from "react";
import { showToast } from "@/utils";
import Notification from "@/components/Notification";
import { createMember, deleteMember, getMembers, updateMember } from "@/services/member";
import { AddMemberModal } from "@/components/modal/add-member-modal";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { getAllPlans } from "@/services/membershipPlan";
import { HashLoader } from "react-spinners";

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
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi thêm thành viên.")
    }
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
      <div className="min-w-screen flex space-between">
        <span className="text-3xl font-bold">Admin/Trang Thành Viên</span>
        {/* ----- Button "Thêm" ----- */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm
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
        onSave={handleAddMember}
      />
      <Notification />
    </div>
  );
}
