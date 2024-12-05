"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import ClassCard from "@/components/card/class-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { ClassDialog } from "@/components/dialog/class-dialog";
import { createClass, deleteClass, getAllClasses, updateClass } from "@/services/class";
import { showToast } from "@/utils";
import { getAllEmployees } from "@/services/employee";
import Notification from "@/components/Notification";


export default function ClassPage() {
  const [ classes, setClasses ] = useState([]);
  const [ trainers, setTrainers] = useState([]);
  const [ selectedClass, setSelectedClass ] = useState(null);
  const [ filterValue, setFilterValue ] = useState("");
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchClasses(), fetchTrainers()]);
    };
    fetchData();
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await getAllClasses();
      if (res.success) {
        setClasses(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin lớp.");
    }
  }

  const fetchTrainers = async () => {
    try {
      const res = await getAllEmployees();
      if (res.success) {
        setTrainers(res.data.filter((item) => item.position.toLowerCase() === "trainer"));
      } else {
        showToast("error", res.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin trainer.")
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
        fetchClasses()
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
            onClick={addClick}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm
            <CirclePlus/>
          </Button>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
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
      )}

      <ClassDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedClass(null)
        }}
        onSave={saveClass}
        onDelete={handleDeleteClass}
        classData={selectedClass}
        trainerData={trainers}
        key={selectedClass ? selectedClass.id : 'new'}
      />
      <Notification />
    </div>
  );
}
