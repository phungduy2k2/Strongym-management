"use client";

import BlogCard from "@/components/card/blog-card";
import Notification from "@/components/Notification";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { getBlogs } from "@/services/blog";
import { showToast } from "@/utils";
import Link from "next/link";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchKeys, setSearchKeys] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await getBlogs();
      if (res.success) {
        setBlogs(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi lấy dữ liệu bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  const [debouncedSearchKeys] = useDebounce(searchKeys, 500);
  const filterBlogs = useCallback((blogs, keywords) => {
    if (!keywords.trim()) return blogs;
    const keywordArray = keywords
      .toLowerCase()
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== "");
    return blogs.filter((blog) =>
      blog.category.some((categoryItem) =>
        keywordArray.some((keywordItem) =>
          categoryItem.toLowerCase().includes(keywordItem)
        )
      )
    );
  }, []);

  const filteredBlogs = useMemo(() => {
    return filterBlogs(blogs, debouncedSearchKeys);
  }, [blogs, debouncedSearchKeys, filterBlogs]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  return isLoading ? (
    <div className="flex mt-32 justify-center items-center">
      <HashLoader loading={isLoading} color="#1e293b" size={50} />
    </div>
  ) : (
    <div className="container mx-auto px-24 py-8 mt-16">
      <div className="max-w-xl mx-auto mb-8">
        <Input
          placeholder='Tìm kiếm theo từ khóa, ví dụ "ngực", "lưng", "cardio"... (cách nhau bởi dấu phẩy)'
          value={searchKeys}
          onChange={(e) => setSearchKeys(e.target.value)}
          className="max-w-xl justify-between"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {paginatedBlogs.map((blog) => (
          // <Link key={blog._id} href={`/blog/${blog._id}`}>
          <BlogCard key={blog._id} blog={blog} />
          // </Link>
        ))}
      </div>

      {/* ----- Pagination -----  */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault;
                  setCurrentPage(i + 1);
                }}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Notification />
    </div>
  );
}
