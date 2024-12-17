"use client";

import BlogCard from "@/components/card/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogContext } from "@/context";
import { getBlogs } from "@/services/blog";
import { getEmployees } from "@/services/employee";
import { showToast } from "@/utils";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchKeys, setSearchKeys] = useState('');
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

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();

      if (response.success) {
        setEmployees(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi lấy thông tin nhân viên.");
    }
  };

  const [debouncedFilterValue] = useDebounce(searchKeys, 500);
  const filterBlogs = useCallback((blogs, keywords) => {
    if (!keywords.trim()) return blogs
    const keywordArray = keywords.toLowerCase().split(",").map(keyword => keyword.trim())
    return blogs.filter(blog => 
        blog.category.some(categoryItem =>
            keywordArray.some(keywordItem => categoryItem.toLowerCase().includes(keywordItem))
        )
    )
  }, [])

  const filteredBlogs = useMemo(() => {
    return filterBlogs(blogs, debouncedFilterValue)
  }, [blogs, debouncedFilterValue, filterBlogs])

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bài viết</h1>
        <div>
          <span className="italic mr-3 font-bold text-gray-600">Tổng: {filteredBlogs.length} bài viết</span>
          <Link href="/admin/blog/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out">
              Thêm bài viết
              <CirclePlus />
            </Button>
          </Link>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} isAdminView={true} />
          ))}
          </div>
        )}
      </div>
    
  );
}
