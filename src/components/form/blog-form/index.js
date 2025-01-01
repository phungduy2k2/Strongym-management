"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dialogMessages } from "@/utils/message";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogForm({ initialData, employees, onSubmit, onDelete }) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState([]);
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthorId(initialData.authorId._id);
      setCategory(initialData.category.join(", "));
      setContent(initialData.content);
      setCanDelete(true);
    }
  }, [initialData]);

  const handleAddContent = (type) => {
    setContent([...content, { type, data: "" }]);
  };

  const handleContentChange = (index, data) => {
    const newContent = [...content];
    newContent[index].data = data;
    setContent(newContent);
  };

  const handleRemoveContent = (index) => {
    const newContent = [...content];
    newContent.splice(index, 1);
    setContent(newContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      authorId,
      category: category.split(",").map((cat) => cat.trim()),
      content,
    });
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="authorId">Tác giả</Label>
          <Select value={authorId} onValueChange={setAuthorId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tác giả" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee._id} value={employee._id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">
            Từ khóa tìm kiếm (cách nhau bởi dấu phẩy)
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <Label>Nội dung</Label>
          {content.map((item, index) => (
            <div key={index} className="mt-2 space-y-2">
              {item.type === "text" ? (
                <Textarea
                  value={item.data}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder="Nhập văn bản..."
                  rows={6}
                />
              ) : (
                <Input
                  type="url"
                  value={item.data}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder={`Điền URL ${item.type}`}
                />
              )}
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveContent(index)}
              >
                Xóa
              </Button>
            </div>
          ))}

          <div className="mt-4 space-x-2">
            <Button
              type="button"
              onClick={() => handleAddContent("text")}
              className="bg-white text-primary hover:bg-gray-200 border border-gray-300"
            >
              <CirclePlus />
              Văn bản
            </Button>
            <Button
              type="button"
              onClick={() => handleAddContent("image")}
              className="bg-white text-primary hover:bg-gray-200 border border-gray-300"
            >
              <CirclePlus />
              Ảnh
            </Button>
            <Button
              type="button"
              onClick={() => handleAddContent("video")}
              className="bg-white text-primary hover:bg-gray-200 border border-gray-300"
            >
              <CirclePlus />
              Video
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* ----- Alert Dialog Delete ----- */}
          {initialData && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">Xóa bài viết</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{dialogMessages.blog.ALERT_DIALOG_TITLE}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogMessages.blog.ALERT_DIALOG_DESCRIPTION}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{dialogMessages.blog.CANCEL}</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>{dialogMessages.blog.DELETE}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          )}
          <Button type="submit"
            className="bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform"
          >
            Lưu bài viết
          </Button>
        </div>
      </form>

      
    </>
  );
}
