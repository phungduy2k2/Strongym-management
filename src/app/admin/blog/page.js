"use client";

import BlogCard from "@/components/card/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlogs } from "@/services/blog";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchKeys, setSearchKeys] = useState("");
  const [activeTab, setActiveTab] = useState('ACCEPTED');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogs();

      if (response.success) {
        setBlogs(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi lấy thông tin bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  const [debouncedFilterValue] = useDebounce(searchKeys, 500);
  const filterBlogs = useCallback((blogs, keywords) => {
    if (!keywords.trim()) return blogs;
    const keywordArray = keywords
      .toLowerCase()
      .split(",")
      .map((keyword) => keyword.trim());
    return blogs.filter((blog) =>
      blog.category.some((categoryItem) =>
        keywordArray.some((keywordItem) =>
          categoryItem.toLowerCase().includes(keywordItem)
        )
      )
    );
  }, []);

  const filteredBlogs = useMemo(() => {
    return filterBlogs(blogs, debouncedFilterValue);
  }, [blogs, debouncedFilterValue, filterBlogs]);

  const blogsFollowStatus = filteredBlogs.filter(blog => blog.approvalStatus === activeTab)
  const counts = {
    PENDING: filteredBlogs.filter(blog => blog.approvalStatus === 'PENDING').length,
    ACCEPTED: filteredBlogs.filter(blog => blog.approvalStatus === 'ACCEPTED').length,
    REJECTED: filteredBlogs.filter(blog => blog.approvalStatus === 'REJECTED').length,
  }

  function handleTabChange(value) {
    setActiveTab(value);
  }

  return (
    <div className="container mx-auto mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
        <div>
          <span className="italic mr-3 font-bold text-gray-600">
            Tổng: {filteredBlogs.length} bài viết
          </span>
        </div>
      </div>

      <Input
        placeholder="Tìm kiếm theo từ khóa (cách nhau bởi dấu phẩy)"
        value={searchKeys}
        onChange={(e) => setSearchKeys(e.target.value)}
        className="max-w-md mb-4"
      />

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
            {blogsFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {blogsFollowStatus.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có bài viết</p>
            )}
          </TabsContent>
          <TabsContent value="ACCEPTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {blogsFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {blogsFollowStatus.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6"> Không có bài viết</p>
            )}
          </TabsContent>
          <TabsContent value="REJECTED" className="border border-gray-400 rounded-md p-4 min-h-[400px]">
            {blogsFollowStatus.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {blogsFollowStatus.map(blog => (
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
