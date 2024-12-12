"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import ClassCard from "@/components/card/class-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { AdminClassDialog } from "@/components/dialog/admin-class-dialog";
import { createClass, deleteClass, getClasses, updateClass } from "@/services/class";
import { showToast } from "@/utils";
import { getEmployees } from "@/services/employee";
import Notification from "@/components/Notification";
import { HashLoader } from "react-spinners";
import { getMembers } from "@/services/member";
import CreateMemberClassDialog from "@/components/dialog/create-member-class";
import { createPayment } from "@/services/payment";
import { createMemberClass } from "@/services/memberClass";

export default function AdminClassPage() {
  const [ classes, setClasses ] = useState([]);
  const [ trainers, setTrainers] = useState([]);
  const [ members, setMembers ] = useState([]);
  const [ selectedClass, setSelectedClass ] = useState(null);
  const [ filterValue, setFilterValue ] = useState("");
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ isPaymentDialogOpen, setIsPaymentDialogOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchClasses(), fetchTrainers(), fetchMembers()]);
    };
    fetchData();
  }, [])

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const res = await getClasses();
      if (res.success) {
        setClasses(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin lớp.");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const res = await getEmployees();
      if (res.success) {
        setTrainers(res.data.filter((item) => item.position.toLowerCase() === "trainer"));
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin trainer.")
    } finally {
      setIsLoading(false);
    }
  }

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await getMembers();
      if (res.success) {
        setMembers(res.data);
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin thành viên.")
    } finally {
      setIsLoading(false);
    }
  }

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(debouncedFilterValue.toLowerCase())
  );

  const cardClick = (classItem) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true)
  };

  const addClick = () => {
    setSelectedClass(null)
    setIsDialogOpen(true)
  }

  const saveClass = async (id, updatedClass) => {
    try {
      let response;
      if (selectedClass) {        
        response = await updateClass(id, updatedClass);
      } else {
        response = await createClass(updatedClass);
      }
      if (response.success) {
        if (selectedClass) {
          setClasses(prevClasses => prevClasses.map(c => c._id === id ? response.data : c));
        } else {
          setClasses(prevClasses => [...prevClasses, response.data]);
        }
        showToast("success", response.message);
        setIsDialogOpen(false)
        // fetchClasses()
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred")
    }
  }

  const handleDeleteClass = async (classId) => {
    try {
      const response = await deleteClass(classId);
      if (response.success) {
        setClasses(prevClasses => prevClasses.filter(c => c.id !== classId));
        showToast("success", response.message);
        fetchClasses()
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred while deleting the class")
    }
  }

  const handleCreatePayment = async (member, cls, method) => {
    try {
      const paymentData = {
        customer: member.name,
        memberId: member._id,
        membershipPlanId: null,
        classId: cls._id,
        amount: cls.price,
        currency: cls.currency,
        description: `Thanh toán cho ${cls.name}`,
        paymentMethod: method
      };
      const response = await createPayment(paymentData);      
      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleCreateMemberClass = async (memberId, classId) => {
    try {
      const formData = { memberId: memberId, classId: classId }
      const response = await createMemberClass(formData);
      if (response.success) {
        showToast("success", response.message)
      } else {
        showToast("error", response.message)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleRegister = (registrationData) => {
    const member = registrationData.member;
    const cls = registrationData.class
    // tạo Payment
    handleCreatePayment(member, cls, registrationData.paymentMethod);
    // tạo memberClass
    handleCreateMemberClass(member._id, cls._id);
    setIsPaymentDialogOpen(false)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin/Trang lop hoc</h1>
      <div className="mb-6 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Tìm lớp học theo tên"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center">
          <Label className="italic mr-3 font-bold text-gray-600">Tổng: {filteredClasses.length} lớp học</Label>
          <Button
            onClick={() => setIsPaymentDialogOpen(true)}
            className="mr-3 bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm học viên
            <CirclePlus/>
          </Button>
          <Button
            onClick={addClick}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm lớp học
            <CirclePlus/>
          </Button>
        </div>
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
        filteredClasses.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Không có lớp học
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classItem) => (
              <ClassCard
                key={classItem._id}
                classItem={classItem}
                onClick={cardClick}
              />
            ))}
          </div>
        )
      )}

      {/* Dialog chi tiết lớp học */}
      <AdminClassDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedClass(null)
        }}
        onSave={saveClass}
        onDelete={handleDeleteClass}
        classData={selectedClass}
        trainerData={trainers}
        key={selectedClass ? selectedClass._id : 'new'}
      />

      {/* Dialog thêm thành viên vào lớp học */}
      <CreateMemberClassDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        members={members}
        classes={classes}
        onRegister={handleRegister}
      />

      <Notification />
    </div>
  );
}
