"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BlogCard({ blog, isAdminView = false }) {
  
  return <Card className="w-full max-w-lg justify-between bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ease-in-out hover:shadow-lg hover:scale-105">
    <CardHeader>
        <CardTitle className="text-xl font-bold truncate">
            <Link href={`blog/${blog._id}`} className="hover:underline">
                {blog.title}
            </Link>
        </CardTitle>
    </CardHeader>
    <CardContent>
        <p className="text-sm italic mb-4 ml-3">{blog.authorId?.name}</p>
        <div className="flex flex-wrap gap-2">
            {blog.category.map((categoryItem, index) => (
                <Badge key={index} className="bg-blue-800 hover:bg-blue-900 text-white">{categoryItem}</Badge>
            ))}
        </div>
    </CardContent>
    <CardFooter className="text-sm italic text-gray-600">
        Cập nhật lần cuối: {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
    </CardFooter>
  </Card>;
}
