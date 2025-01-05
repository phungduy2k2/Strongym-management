import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// update blog approvalStatus PENDING -> REJECTED
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    connectToDB();
    const rejectedBlog = await Blog.findOneAndUpdate(
      { _id: params.id, approvalStatus: "PENDING" },
      { approvalStatus: "REJECTED" },
      { new: true }
    );

    if (!rejectedBlog) {
      return NextResponse.json({
        success: false,
        message: messages.rejectBlog.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.rejectBlog.SUCCESS,
      data: rejectedBlog,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.rejectBlog.ERROR,
    }, { status: 500 });
  }
}
