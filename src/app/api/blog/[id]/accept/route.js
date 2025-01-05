import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// update blog approvalStatus PENDING -> ACCEPTED
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    connectToDB();
    const acceptedBlog = await Blog.findOneAndUpdate(
      { _id: params.id, approvalStatus: "PENDING" },
      { approvalStatus: "ACCEPTED" },
      { new: true }
    );

    if (!acceptedBlog) {
      return NextResponse.json({
        success: false,
        message: messages.acceptBlog.NOT_FOUND,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: messages.acceptBlog.SUCCESS,
      data: acceptedBlog,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.acceptBlog.ERROR,
    }, { status: 500 });
  }
}
