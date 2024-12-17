import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const contentSchema = Joi.object({
  type: Joi.string().valid("text", "image", "video").required(),
  data: Joi.string().required(),
  _id: Joi.string(),
});

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.array().items(contentSchema).min(1).required(),
  category: Joi.array().items(Joi.string().max(20)).optional(),
  authorId: Joi.string().required(),
});

// get blog by id
export async function GET(req, { params }) {
  const authError = await authorize(req, ["member", "manager"]);
  if (authError) return authError;

  try {
    await connectToDB();
    const blog = await Blog.findById(params.id).populate("authorId", "name"); ///populate creatorId (User)
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: messages.getBlogById.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getBlogById.ERROR,
    }, { status: 500 });
  }
}

// update blog
export async function PUT(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  try {
    const { title, content, category, authorId } = await req.json();
    const { error } = schema.validate({ title, content, category, authorId });
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      }, { status: 400 });
    }

    await connectToDB();
    const updatedBlog = await Blog.findByIdAndUpdate(params.id, { title, content, category, authorId}, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) {
      return NextResponse.json({
        success: false,
        message: messages.updateBlog.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.updateBlog.SUCCESS,
      data: updatedBlog,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updateBlog.ERROR,
    }, { status: 500 });
  }
}

// delete blog
export async function DELETE(req, { params }) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;
  
  try {
    await connectToDB();
    const deletedBlog = await Blog.findByIdAndDelete(params.id);
    if (!deletedBlog) {
      return NextResponse.json({
        success: false,
        message: messages.deleteBlog.NOT_FOUND,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: messages.deleteBlog.SUCCESS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.deleteBlog.ERROR,
    }, { status: 500 });
  }
}
