"use client";

import ClassCard from "@/components/card/class-card";
import { DetailClassDialog } from "@/components/dialog/detail-class-dialog";
import Notification from "@/components/Notification";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClass, deleteClass, getClasses, updateClass } from "@/services/class";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function TrainerClass({ userInfo }) {
  const [myClasses, setMyClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("ACCEPTED");
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await getClasses();
      console.log(response, "res classes");

      if (response.success) {
        const data = response.data.filter(
          (item) => item.trainerId?._id === userInfo.employeeId
        );
        console.log(data, "my classes");

        setMyClasses(data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin bài viết của bạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = myClasses.filter(
    (cls) => cls.approvalStatus === activeTab
  );
  const counts = {
    PENDING: myClasses.filter((cls) => cls.approvalStatus === "PENDING").length,
    ACCEPTED: myClasses.filter((cls) => cls.approvalStatus === "ACCEPTED").length,
    REJECTED: myClasses.filter((cls) => cls.approvalStatus === "REJECTED").length,
  };

  function handleTabChange(value) {
    setActiveTab(value);
  }

  const cardClick = (classItem) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true);
  };

  const addClick = () => {
    setSelectedClass(null);
    setIsDialogOpen(true);
  };

  const saveClass = async (id, updatedClass) => {
    try {
      let response;
      if (selectedClass) {
        response = await updateClass(id, updatedClass);
      } else {
        response = await createClass(updatedClass);
      }
      console.log(response, 'res save class');
      
      if (response.success) {
        if (selectedClass) {
          setMyClasses((prevClasses) =>
            prevClasses.map((c) => (c._id === id ? response.data : c))
          );
        } else {
          setMyClasses((prevClasses) => [...prevClasses, response.data]);
        }
        showToast("success", response.message);
        setIsDialogOpen(false);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred");
    }
  };

  const handleDeleteClass = async (classId) => {
    console.log("class deleted");
    try {
      const response = await deleteClass(classId);
      if (response.success) {
        setMyClasses(prevClasses => prevClasses.filter(c => c.id !== classId))
        showToast("success", response.message)
      } else {
        showToast("error", response.message)
      }
    } catch (err) {
      showToast("error", "An unexpected error occurred");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lớp học của bạn</h1>
        <Button
          onClick={addClick}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm lớp học
          <CirclePlus />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-end">
            <TabsList className="grid grid-cols-3 bg-gray-200 p-1">
              <TabsTrigger
                value="PENDING"
                className={`rounded-md transition-colors ${
                  activeTab === "PENDING" ? "" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Đang chờ ({counts.PENDING})
              </TabsTrigger>
              <TabsTrigger
                value="ACCEPTED"
                className={`rounded-md transition-colors ${
                  activeTab === "ACCEPTED"
                    ? ""
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Đã duyệt ({counts.ACCEPTED})
              </TabsTrigger>
              <TabsTrigger
                value="REJECTED"
                className={`rounded-md transition-colors ${
                  activeTab === "REJECTED"
                    ? ""
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Từ chối ({counts.REJECTED})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="PENDING"
            className="border border-gray-400 rounded-md p-4 min-h-[400px]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClasses.map((cls) => (
                <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="ACCEPTED"
            className="border border-gray-400 rounded-md p-4 min-h-[400px]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClasses.map((cls) => (
                <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="REJECTED"
            className="border border-gray-400 rounded-md p-4 min-h-[400px]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClasses.map((cls) => (
                <ClassCard key={cls._id} classItem={cls} onClick={cardClick} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialog chi tiết lớp học */}
      <DetailClassDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedClass(null);
        }}
        onSave={saveClass}
        onDelete={handleDeleteClass}
        classData={selectedClass}
        trainerData={userInfo?.employeeId}
        key={selectedClass ? selectedClass._id : "new"}
      />

      <Notification />
    </div>
  );
}
