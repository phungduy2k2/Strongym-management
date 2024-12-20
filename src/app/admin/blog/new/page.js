"use client";

import BlogForm from "@/components/form/blog-form";
import Notification from "@/components/Notification";
import { createBlog } from "@/services/blog";
import { getEmployees } from "@/services/employee";
import { showToast } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function NewBlogPage() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      showToast("error", "Có lỗi khi lấy thông tin nhân viên.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (newBlog) => {
    try {
      const response = await createBlog(newBlog);
      if (response.success) {
        showToast("success", response.message)
        router.push("/admin/blog")
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi tạo bài viết mới.");
    }
  };

  return (
    <>
    <div className="container w-full">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <div>
            <h1 className="text-2xl font-bold mb-8">Tạo bài viết mới</h1>
            <BlogForm employees={employees} onSubmit={handleSubmit} />
        </div>
      )}
    </div>

    <Notification/>
    </>
  );
}
