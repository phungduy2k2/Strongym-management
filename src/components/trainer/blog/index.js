"use client";

import BlogCard from "@/components/card/blog-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlogs } from "@/services/blog";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function TrainerBlog({ userInfo }) {
  const [myBlogs, setMyBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogs();

      if (response.success) {
        const data = response.data.filter(
          (item) => item.authorId?._id === userInfo.employeeId
        );
        setMyBlogs(data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin bài viết của bạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = myBlogs.filter(blog => blog.approvalStatus === activeTab)
  const counts = {
    PENDING: myBlogs.filter(blog => blog.approvalStatus === 'PENDING').length,
    ACCEPTED: myBlogs.filter(blog => blog.approvalStatus === 'ACCEPTED').length,
    REJECTED: myBlogs.filter(blog => blog.approvalStatus === 'REJECTED').length,
  }

  function handleTabChange(value) {
    setActiveTab(value);
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bài viết của bạn</h1>
        <Link href={{ pathname: "/admin/trainer/blog/new", query: { authorId: "your-author-id" } }}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out">
              Thêm bài viết
              <CirclePlus />
            </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-end">
            <TabsList className="grid grid-cols-3 bg-gray-200 p-1">
              <TabsTrigger value="PENDING" className={`rounded-md transition-colors ${
                activeTab === 'PENDING' ? '' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Đang chờ ({counts.PENDING})
              </TabsTrigger>
              <TabsTrigger value="ACCEPTED" className={`rounded-md transition-colors ${
                activeTab === 'ACCEPTED' ? '' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Đã duyệt ({counts.ACCEPTED})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className={`rounded-md transition-colors ${
                activeTab === 'REJECTED' ? '' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Từ chối ({counts.REJECTED})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="PENDING" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {filteredBlogs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredBlogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có bài viết</p>
            )}
          </TabsContent>
          <TabsContent value="ACCEPTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {filteredBlogs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredBlogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có bài viết</p>
            )}
          </TabsContent>
          <TabsContent value="REJECTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {filteredBlogs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredBlogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có bài viết</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
