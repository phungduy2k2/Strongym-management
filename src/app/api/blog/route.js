import connectToDB from "@/database";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { authorize } from "@/lib/middleware";

const contentSchema = Joi.object({
  type: Joi.string().valid('text', 'image', 'video').required(),
  data: Joi.string().required(),
})

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.array().items(contentSchema).min(1).required(),
  category: Joi.array().items(Joi.string().max(20)).optional(),
  authorId: Joi.string().required(),
});

export const dynamic = "force-dynamic";

//get all blogs
export async function GET() {
  const authError = await authorize(["manager", "member"]);
  if (authError) return authError;
  
  try {
    await connectToDB();
    const allBlogs = await Blog.find({}).populate("authorId", "name");
    return NextResponse.json({
      success: true,
      data: allBlogs
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.getAllBlog.ERROR
    }, { status: 500 });
  }
}

// add new blog
export async function POST(req) {
  const authError = await authorize(req, ["manager"]);
  if (authError) return authError;

  const { title, content, category, authorId } = await req.json();

  const { error } = schema.validate({ title, content, category, authorId });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    }, { status: 400 });
  }

  try {
    await connectToDB();
    const blogExist = await Blog.findOne({ title });
    if (blogExist) {
      return NextResponse.json({
        success: false,
        message: messages.addBlog.BLOG_EXIST,
      }, { status: 409 });
    }

    const newBlog = await Blog.create({ title, content, category, authorId });
    if (newBlog) {
      return NextResponse.json({
        success: true,
        message: messages.addBlog.SUCCESS,
        data: newBlog
      }, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.addBlog.ERROR,
    }, { status: 500 });
  }
}
