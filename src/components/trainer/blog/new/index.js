"use client";

import BlogForm from "@/components/form/blog-form";
import Notification from "@/components/Notification";
import { Button } from "@/components/ui/button";
import { createBlog } from "@/services/blog";
import { showToast } from "@/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HashLoader } from "react-spinners";

export default function NewBlogComponent({ userInfo }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();  

  const handleSubmit = async (newBlog) => {
    try {
      const response = await createBlog(newBlog);
      if (response.success) {
        showToast("success", response.message);
        router.push("/admin/trainer/blog");
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
            <div className="flex">
              <Link href="/admin/trainer/blog" passHref>
                <Button variant="ghost" className="mr-6">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Button>
              </Link>
              <h1 className="text-2xl font-bold mb-8">Tạo bài viết mới</h1>
            </div>
            <BlogForm onSubmit={handleSubmit} author={userInfo} />
          </div>
        )}
      </div>

      <Notification />
    </>
  );
}
