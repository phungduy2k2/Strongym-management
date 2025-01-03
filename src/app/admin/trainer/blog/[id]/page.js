"use client";

import BlogForm from "@/components/form/blog-form";
import { Button } from "@/components/ui/button";
import { deleteBlog, getBlogById, updateBlog } from "@/services/blog";
import { getEmployees } from "@/services/employee";
import { showToast } from "@/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function TrainerBlogEditPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params_id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [blogData, employeesData] = await Promise.all([
        getBlogById(params_id),
        getEmployees(),
      ]);
      setBlog(blogData.data);
      setEmployees(employeesData.data);
      setIsLoading(false);
    };
    fetchData();
  }, [params_id]);

  const handleSubmit = async (updatedBlog) => {
    try {
      const response = await updateBlog(params.id, updatedBlog);
      if (response.success) {
        showToast("success", response.message);
        router.push("/admin/trainer/blog");
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi cập nhật bài viết.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteBlog(params_id)
      if (response.success) {
        showToast("success", response.message)
        router.push("/admin/trainer/blog")
      } else {
        showToast("error", response.message);
      }
    } catch (err){
      showToast("error", "Có lỗi khi xóa bài viết.");
    }
  }

  return (
    <div className="container mx-auto mb-6">
      <div className="flex">
        <Link href="/admin/trainer/blog" passHref>
          <Button variant="ghost" className="mr-6">
            <ArrowLeft className="mr-2 h-4 w-4"/> Quay lại
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-8">Chi tiết bài viết</h1>
      </div>
      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <BlogForm
          initialData={blog}
          employees={employees}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
