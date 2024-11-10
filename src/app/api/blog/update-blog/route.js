import connectToDB from "@/database";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const { _id, title, content, category, creatorId } = await req.json();

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: _id },
      { title, content, category, creatorId },
      { new: true }
    );

    if (updatedBlog) {
      return NextResponse.json({
        success: true,
        message: messages.updateBlog.SUCCESS,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: messages.updateBlog.ERROR,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: messages.updateBlog.ERROR,
    });
  }
}
