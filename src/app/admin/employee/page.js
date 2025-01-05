"use client";

import AddEmployeeModal from "@/components/modal/add-employee-modal";
import Notification from "@/components/Notification";
import EmployeeTable from "@/components/table/employee-table";
import { Button } from "@/components/ui/button";
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/services/employee";
import { createClerkAccount, createUser } from "@/services/user";
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

  // Thêm bản ghi Employee
  const handleAddEmployee = async (newEmployee) => {
    try {
      const res = await createEmployee(newEmployee);      
      if (res.success) {
        setEmployees((prev) => [...prev, res.data]);
        showToast("success", res.message);
        setIsModalOpen(false);
        return res;
      } else {
        showToast("error", res.message);
        return res;
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  // Tạo tài khoản Clerk cho trainer
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

  const handleSaveNewEmployee = async (newEmployee) => {
    console.log(newEmployee, 'newEmployee');
    const {email, ...employeeData} = newEmployee;

    if (newEmployee.position === "trainer") {
      const clerkData = {
        username: newEmployee.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, "_"),
        email: email,
        role: "trainer"
      }
      const [addEmployeeRes, createClerkRes] = await Promise.all([
        handleAddEmployee(employeeData),
        handleCreateClerk(clerkData)
      ])
      console.log(addEmployeeRes, 'addEmployeeRes');
      console.log(createClerkRes, 'createClerkRes');
      

      // Tạo bản ghi User (liên kết với bản ghi Employee và tài khoản Clerk)
      try {
        const newUserData = {
          userId: createClerkRes.data.id,
          username: clerkData.username,
          email: email,
          employeeId: addEmployeeRes.data._id,
          role: clerkData.role
        }
        console.log(newUserData,'newUserData');
        
        const res = await createUser(newUserData);
        console.log(res, 'res createUser');
        
        if(res.success) {
          showToast("success", res.message)
        } else {
          showToast("error", res.message)
        }
      } catch (err) {
        showToast("error", "Có lỗi xảy ra khi thêm bản ghi User.")
      }
    } else {
      await handleAddEmployee(employeeData)
    }
  }

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

  // Xóa bản ghi Employee
  const handleDeleteEmployee = async (id) => {
    try {
      const res = await deleteEmployee(id);
      console.log(res, 'res delete Employee');
      
      if (res.success) {
        setEmployees (prev => prev.filter(member => member._id !== id))
        showToast("success", res.message)
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred while deleting the employee")
    }
  }

  // // Xóa bản ghi User của employee nếu đó là trainer
  // const handleDeleteUser = async (id) => {
  //   try {
  //     const res = await deleteUser(id);
  //     console.log(res, 'res delete User');

  //     if (res.success) {
  //       showToast("success", res.message)
  //     } else {
  //       showToast("error", res.message)
  //     }
  //   } catch (err) {
  //     showToast("error", "An unexpected error occurred while deleting User record")
  //   }
  // }

  // // Xóa tài khoản Clerk của employee nếu đó là trainer
  // const handleDeleteClerkAccount = async (id) => {
  //   try {
  //     const res = await deleteClerkAcount(id);
  //     console.log(res, 'res delete Clerk account');

  //     if (res.success) {
  //       showToast("success", res.message)
  //     } else {
  //       showToast("error", res.message)
  //     }
  //   } catch (err) {
  //     showToast("error", "An unexpected error occurred while deleting Clerk account")
  //   }
  // }

  // // Hành động xóa 1 employee
  // const handleDelete = async (selectedEmp) => {
  //   console.log(selectedEmp, 'selectedEmp to delete');
  //   if(selectedEmp.position === "trainer") {
  //     try {
  //       const res = await getUserByEmployeeId(selectedEmp._id);
  //       console.log(res, 'getUserById');
        
  //       if (res.success) {
  //         await Promise.all([
  //           handleDeleteEmployee(selectedEmp._id),
  //           handleDeleteUser(res.data._id),
  //           handleDeleteClerkAccount(res.data.userId)
  //         ])
  //       } else {
  //         showToast("error", res.message);
  //       }
  //     } catch {
  //       showToast("error", "An unexpected error occurred while deleting this employee")
  //     }
  //   } else {
  //     await handleDeleteEmployee(selectedEmp._id)
  //   }
  // }

  return (
    <div className="flex flex-col">
      <div className="min-w-screen mb-6 flex justify-between items-center">
        <span className="text-3xl font-bold">Quản lý nhân viên</span>
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
        onSave={handleSaveNewEmployee}
      />
      <Notification />
    </div>
  );
}
