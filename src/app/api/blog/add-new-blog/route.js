import connectToDB from "@/database";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  category: Joi.array().items(Joi.string().max(20)).optional(),
  creatorId: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();
  const { title, content, category, creatorId } = await req.json();

  const { error } = schema.validate({
    title,
    content,
    category,
    creatorId,
  });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const blogExist = await Blog.findOne({ phone });
    if (blogExist) {
      return NextResponse.json({
        success: false,
        message: messages.addBlog.BLOG_EXIST,
      });
    } else {
      const newBlog = await Blog.create({
        title,
        content,
        category,
        creatorId,
      });

      if (newBlog) {
        return NextResponse.json({
          success: true,
          message: messages.addBlog.SUCCESS,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.addBlog.ERROR,
    });
  }
}
