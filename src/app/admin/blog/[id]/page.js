"use client";

import Notification from "@/components/Notification";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { acceptBlog, deleteBlog, getBlogById, rejectBlog, updateBlog } from "@/services/blog";
import { showToast } from "@/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function AdminBlogDetailPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isPendingBlog, setIsPendingBlog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params_id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const blogData = await getBlogById(params_id);
      setBlog(blogData.data);
      setIsPendingBlog(blogData.data.approvalStatus === "PENDING");
      setIsLoading(false);
    };
    fetchData();
  }, [params_id]);

  const handleSubmit = async (updatedBlog) => {
    try {
      const response = await updateBlog(params.id, updatedBlog);
      if (response.success) {
        showToast("success", response.message);
        router.push("/admin/blog");
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi cập nhật bài viết.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteBlog(params_id);
      if (response.success) {
        showToast("success", response.message);
        router.push("/admin/blog");
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi xóa bài viết.");
    }
  };

  const handleAcceptBlog = async () => {
    try {
      const response = await acceptBlog(params_id);
      
      if(response.success) {
        showToast("success", response.message);
        router.push("/admin/blog");
      } else {
        showToast("error", response.message)
      }
    } catch (err) {
      showToast("error", "Có lỗi khi duyệt bài viết.");
    }
  };

  const handleRejectBlog = async () => {
    try {
      const response = await rejectBlog(params_id);
      
      if(response.success) {
        showToast("success", response.message);
        router.push("/admin/blog");
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi từ chối bài viết.");
    }
  };

  return (
    <div className="container mx-auto mb-6">
      <div className="flex">
        <Link href="/admin/blog" passHref>
          <Button variant="ghost" className="mr-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-8">Chi tiết bài viết</h1>
      </div>
      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <div className="px-4 pb-8">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <div className="mb-4 text-gray-600 flex-end">
            <span>Tg: {blog.authorId.name}</span>
            <span className="mx-2">|</span>
            <span>{new Date(blog.updatedAt).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {blog.category.map((categoryItem, index) => (
              <Badge
                key={index}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                {categoryItem}
              </Badge>
            ))}
          </div>

          {blog.content.map((item, index) => {
            switch (item.type) {
              case "text":
                return (
                  <div key={index} className="mb-6">
                    {item.data.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
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
                  <video
                    key={index}
                    controls
                    className="mb-6 max-w-[80%] m-auto h-auto"
                  >
                    <source src={item.data} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ hiển thị video.
                  </video>
                );
              default:
                return null;
            }
          })}

          {/* ----- Action with Blog ----- */}
          {isPendingBlog ? ( /// Nếu đây là blog đang chờ duyệt
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setAcceptDialogOpen(true)}
                className="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow"
              >
                Duyệt
              </Button>
              <Button
                onClick={() => setRejectDialogOpen(true)}
                variant="destructive"
              >
                Từ chối
              </Button>
              
              {/* ----- Alert Dialog Accept ----- */}
              <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận duyệt bài viết</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn đồng ý chấp nhận bài viết này?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAcceptBlog}>Đồng ý</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* ----- Alert Dialog Reject ----- */}
              <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận từ chối bài viết</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn xác nhận từ chối bài viết này?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRejectBlog}>Đồng ý</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </div>
      )}


      <Notification/>
    </div>
  );
}
