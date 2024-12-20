"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogById } from "@/services/blog";
import { showToast } from "@/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function BlogDetailPage({ params }) {
  const params_id = params.id;
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogById = async () => {
      try {
        setIsLoading(true);
        const response = await getBlogById(params_id);
        if (response.success) {
          setBlog(response.data);
        } else {
          showToast("error", response.message);
        }
      } catch (err) {
        showToast("error", "Có lỗi khi lấy thông tin lớp học này");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogById();
  }, [params_id]);

  return isLoading ? (
    <div className="flex mt-32 justify-center items-center">
      <HashLoader loading={isLoading} color="#1e293b" size={50} />
    </div>
  ) : (
    <div className="container mx-auto px-28 py-8 mt-16">
      <Link href="/blog" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4"/> Quay lại
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="mb-4 text-gray-600 flex-end">
        <span>Tg: {blog.authorId.name}</span>
        <span className="mx-2">|</span>
        <span>{new Date(blog.updatedAt).toLocaleDateString("vi-VN")}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {blog.category.map((categoryItem, index) => (
          <Badge key={index} className="bg-blue-800 hover:bg-blue-900 text-white">{categoryItem}</Badge>
        ))}
      </div>

      {blog.content.map((item, index) => {
        switch (item.type) {
          case "text":
            return (
              <div key={index} className="mb-6">
                {item.data.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            );
          case "image":
            return (
              <img
                key={index}
                src={item.data}
                alt="Ảnh minh họa"
                className="mb-6 max-w-[60%] m-auto h-auto"
              />
            );
          case "video":
            return (
              <video key={index} controls className="mb-6 max-w-[80%] m-auto h-auto">
                <source src={item.data} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ hiển thị video.
              </video>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
