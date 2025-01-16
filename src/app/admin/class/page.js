"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import ClassCard from "@/components/card/class-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { acceptClass, createClass, deleteClass, getClasses, registerClass, rejectClass, updateClass } from "@/services/class";
import { showToast } from "@/utils";
import { getEmployees } from "@/services/employee";
import Notification from "@/components/Notification";
import { HashLoader } from "react-spinners";
import { getMembers } from "@/services/member";
import CreateMemberClassDialog from "@/components/dialog/create-member-class";
import { createPayment } from "@/services/payment";
import { createMemberClass } from "@/services/memberClass";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminClassDialog from "@/components/dialog/admin-class-dialog";

export default function AdminClassPage() {
  const [ classes, setClasses ] = useState([]);
  const [ trainers, setTrainers ] = useState([]);
  const [ activeTab, setActiveTab ] = useState("ACCEPTED");
  const [ members, setMembers ] = useState([]);
  const [ selectedClass, setSelectedClass ] = useState(null);
  const [ filterValue, setFilterValue ] = useState("");
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ isPaymentDialogOpen, setIsPaymentDialogOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchClasses(), fetchTrainers(), fetchActiveMembers()]);
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
        setTrainers(res.data.filter(emp => emp.position.toLowerCase() === "trainer"));
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin trainer.")
    } finally {
      setIsLoading(false);
    }
  }

  const fetchActiveMembers = async () => {
    try {
      setIsLoading(true);
      const res = await getMembers();
      if (res.success) {
        setMembers(res.data.filter(mem => mem.status === "active"));
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

  const classesFollowStatus = filteredClasses.filter(cls => cls.approvalStatus === activeTab);
  const counts = {
    PENDING: filteredClasses.filter(cls => cls.approvalStatus === "PENDING").length,
    ACCEPTED: filteredClasses.filter(cls => cls.approvalStatus === "ACCEPTED").length,
    REJECTED: filteredClasses.filter(cls => cls.approvalStatus === "REJECTED").length,
  };

  function handleTabChange(value) {
    setActiveTab(value);
  }

  const cardClick = (classItem) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true)
  };

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

  const handleAcceptClass = async (classId) => {
    try {
      const response = await acceptClass(classId);
          
      if(response.success) {
        setIsDialogOpen(false);
        setClasses((prevClasses) =>
          prevClasses.map((c) => (c._id === classId ? response.data : c))
        );
        showToast("success", response.message);
      } else {
        showToast("error", response.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi khi duyệt lớp học.");
    }
  }

  const handleRejectClass = async (classId) => {
    try {
      const response = await rejectClass(classId);
          
      if(response.success) {
        setIsDialogOpen(false);
        setClasses((prevClasses) =>
          prevClasses.map((c) => (c._id === classId ? response.data : c))
        );
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi từ chối lớp học.");
    }
  }

  const handleCreatePayment = async (member, classId, className, price, currency, method) => {
    try { 
      const paymentData = {
        customer: member.name,
        memberId: member._id,
        membershipPlanId: null,
        classId: classId,
        amount: price,
        currency: currency,
        description: `Thanh toán cho ${className}`,
        paymentMethod: method
      };
      const response = await createPayment(paymentData);      
      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
        throw new Error(response.message);
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
        throw new Error(response.message);
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleUpdateClass = async (classId, memberId) => {
    try {
      const response = await registerClass(classId, memberId)
      if (response.success) {
        showToast("success", response.message)
      } else {
        showToast("error", response.message)
        throw new Error(response.message);
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleRegister = (registrationData) => {
    const member = registrationData.member;
    const { _id: classId, name: className, price, currency } = registrationData.class
    const handleData = async () => {
      await Promise.all([
        handleCreatePayment(member, classId, className, price, currency, registrationData.paymentMethod),
        handleCreateMemberClass(member._id, classId),
        handleUpdateClass(classId, member._id),
      ]);
    };
    handleData();
    setIsPaymentDialogOpen(false)
  }

  return (
    <div className="container mx-auto mb-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý lớp học</h1>
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
          {/* <Button
            onClick={addClick}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm lớp học
            <CirclePlus/>
          </Button> */}
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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-end">
            <TabsList className="grid grid-cols-3 bg-gray-200 p-1">
              <TabsTrigger value="PENDING" className={`rounded-md transition-colors ${activeTab === "PENDING" ? "" : "bg-gray-200 hover:bg-gray-300"}`}>
                Đang chờ ({counts.PENDING})
              </TabsTrigger>
              <TabsTrigger value="ACCEPTED" className={`rounded-md transition-colors ${activeTab === "ACCEPTED" ? "" : "bg-gray-200 hover:bg-gray-300"}`}>
                Đã duyệt ({counts.ACCEPTED})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className={`rounded-md transition-colors ${activeTab === "REJECTED" ? "" : "bg-gray-200 hover:bg-gray-300"}`}>
                Từ chối ({counts.REJECTED})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="PENDING" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {classesFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {classesFollowStatus.map((cls) => (
                  <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có lớp học</p>
            )}
          </TabsContent>
          <TabsContent value="ACCEPTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {classesFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {classesFollowStatus.map((cls) => (
                  <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có lớp học</p>
            )}
          </TabsContent>
          <TabsContent value="REJECTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {classesFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {classesFollowStatus.map((cls) => (
                  <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có lớp học</p>
            )}
          </TabsContent>
        </Tabs>
        )
      )}

      {/* Dialog chi tiết lớp học */}
      <AdminClassDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedClass(null)
        }}
        class={selectedClass}
        onAccept={handleAcceptClass}
        onReject={handleRejectClass}
        key={selectedClass ? selectedClass._id : "new"}
      />

      {/* Dialog thêm thành viên vào lớp học */}
      <CreateMemberClassDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        members={members}
        classes={classes.filter(cls => cls.approvalStatus === "ACCEPTED" && cls.status.toLowerCase() !== "expired")}
        onRegister={handleRegister}
      />

      <Notification />
    </div>
  );
}
