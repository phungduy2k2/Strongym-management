"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BlogCard({ blog, isAdminView = false }) {
  
  return <Card className="w-full max-w-md">
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
                <Badge key={index} variant="secondary">{categoryItem}</Badge>
            ))}
        </div>
    </CardContent>
    <CardFooter className="text-sm italic text-gray-600">
        Cập nhật lần cuối: {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
    </CardFooter>
  </Card>;
}
