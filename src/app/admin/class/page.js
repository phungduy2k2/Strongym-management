"use client";

import { useState } from "react";
import ClassCard from "@/components/card/class-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { ClassDialog } from "@/components/dialog/class-dialog";

const initialClasses = [
  {
    id: "1",
    name: "Yoga toàn thân",
    trainerId: "Mohamed Aliyah",
    image:
      "https://www.hoasen.edu.vn/hsusports/wp-content/uploads/sites/51/2023/07/a.jpg",
    price: '7000000',
    description: 'Thư giãn tâm trí và làm mới cơ thể với lớp học yoga đặc biệt của chúng tôi. Phù hợp cho mọi cấp độ, lớp học này kết hợp các bài tập hít thở, thiền định và chuỗi động tác nhẹ nhàng để tăng cường sự linh hoạt, giảm căng thẳng và cải thiện sức khỏe toàn diện. Hãy tham gia để tìm lại sự cân bằng và năng lượng trong cuộc sống!',
    startDate: "2024-06-10",
    endDate: "2024-12-10",
  },
  {
    id: "2",
    name: "Boxing cho người mới",
    trainerId: "Hoàng Long",
    image:
      "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2020/05/cross-punch-boxing.jpg?quality=86&strip=all",
    price: '10000000',
    description: 'Lớp học boxing dành cho người mới bắt đầu, giúp bạn làm quen với các kỹ thuật cơ bản như tư thế, cú đấm, và di chuyển chân. Chương trình được thiết kế nhẹ nhàng, phù hợp cho mọi thể trạng, kết hợp bài tập tăng cường sức mạnh và cải thiện thể lực. Tham gia để vừa rèn luyện sức khỏe, vừa khám phá sức mạnh bản thân trong một môi trường đầy năng lượng!',
    startDate: "2024-08-15",
    endDate: "2025-02-15",
  },
  {
    id: "3",
    name: "Giảm mỡ toàn thân",
    trainerId: "Tuấn Nguyễn",
    image:
      "https://thammyvienngocdung.com/wp-content/uploads/2023/08/cach-giam-mo-bung-0.jpg",
    price: '5000000',
    description: 'Đốt cháy năng lượng, giảm mỡ hiệu quả với lớp học chuyên biệt dành cho toàn thân. Kết hợp các bài tập cardio, HIIT (High-Intensity Interval Training), và strength training, lớp học này giúp bạn cải thiện sức bền, săn chắc cơ bắp, và tăng cường sự trao đổi chất. Phù hợp với mọi cấp độ thể trạng, đây là lựa chọn lý tưởng để đạt được vóc dáng mong muốn một cách nhanh chóng và an toàn!',
    startDate: "2024-09-05",
    endDate: "2024-12-05",
  },
  {
    id: "4",
    name: "Cardio",
    trainerId: "Trang Lê",
    image: "https://ptfitness.vn/wp-content/uploads/2024/04/tap-cardio.jpg",
    price: '4500000',
    description: 'Lớp Cardio Blast mang đến trải nghiệm tập luyện đầy năng lượng, giúp bạn cải thiện sức khỏe tim mạch, tăng cường sức bền và đốt cháy calo hiệu quả. Với các bài tập liên hoàn như chạy bộ, nhảy dây, bật nhảy, và bước nhanh, lớp học này phù hợp cho mọi đối tượng, từ người mới bắt đầu đến những ai muốn nâng cao thể lực. Hãy tham gia để cảm nhận sự khác biệt trong từng nhịp đập!',
    startDate: "2024-10-20",
    endDate: "2024-12-20",
  },
];

export default function ClassPage() {
  const [ classes, setClasses ] = useState(initialClasses);
  const [ selectedClass, setSelectedClass ] = useState(null);
  const [ filterValue, setFilterValue ] = useState("");
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const handleCardClick = (classItem) => {
    setSelectedClass(classItem);
    setIsDialogOpen(true)
    ///// Open dialog ///////
  };

  const handleAddClick = () => {
    setSelectedClass(null)
    setIsDialogOpen(true)
    //////// open create dialog //////
  }

  const handleSaveClass = (updatedClass) => {
    if (selectedClass) {
      // Editing existing class
      setClasses(prevClasses => prevClasses.map(c => c.id === selectedClass.id ? { ...updatedClass, id: c.id } : c))
    } else {
      // Adding new class
      setClasses(prevClasses => [...prevClasses, { ...updatedClass, id: Date.now().toString() }])
    }
    console.log(classes, 'classes');
  }

  const handleDeleteClass = (classId) => {
    ////// Sau cho service vao day
    setClasses(prevClasses => prevClasses.filter(c => c.id !== classId))
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
            onClick={handleAddClick}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            Thêm
            <CirclePlus/>
          </Button>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Không có lớp nào tương ứng
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onClick={handleCardClick}
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
        onSave={handleSaveClass}
        onDelete={handleDeleteClass}
        classData={selectedClass}
        key={selectedClass ? selectedClass.id : 'new'}
      />
    </div>
  );
}
