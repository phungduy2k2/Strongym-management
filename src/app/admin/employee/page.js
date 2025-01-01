"use client";

import AddEmployeeModal from "@/components/modal/add-employee-modal";
import Notification from "@/components/Notification";
import EmployeeTable from "@/components/table/employee-table";
import { Button } from "@/components/ui/button";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/employee";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await getEmployees();
      if (response.success) {
        setEmployees(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin nhân viên.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const res = await createEmployee(newEmployee);      
      if (res.success) {
        setEmployees((prev) => [...prev, res.data]);
        showToast("success", res.message);
        setIsModalOpen(false);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  const handleUpdateEmployee = async (id, updatedEmployee) => {
    try {
      const res = await updateEmployee(id, updatedEmployee);
      if (res.success) {
        setEmployees((prev) =>
          prev.map((member) => (member._id === id ? res.data : member))
        );
        showToast("success", res.message);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error","An unexpected error occurred while updating the employee.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const res = await deleteEmployee(id);
      if (res.success) {
        setEmployees (prev => prev.filter(member => member._id !== id))
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
        <span className="text-3xl font-bold">Danh sách nhân viên</span>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm nhân viên
        <CirclePlus/>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <HashLoader
            loading={isLoading}
            color="#1e293b"
            size={50}
          />
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onUpdate={handleUpdateEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEmployee}
      />
      <Notification />
    </div>
  );
}
