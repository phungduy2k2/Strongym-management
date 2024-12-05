"use client";

import Notification from "@/components/Notification";
import EmployeeTable from "@/components/table/employee-table";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/employee";
import { showToast } from "@/utils";
import { useEffect, useState } from "react";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
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
        //close modal add
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

  if (isLoading) return <div className="flex justify-center items-center">LOADING...</div>

  return (
    <div className="flex flex-col">
      <span className="text-3xl font-bold">Admin/Trang Nhân Viên</span>
      
      <EmployeeTable
        employees={employees}
        onUpdate={handleUpdateEmployee}
        onDelete={handleDeleteEmployee}
      />

      <Notification />
    </div>
  );
}
