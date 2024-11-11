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

// add new blog
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
    const blogExist = await Blog.findOne({ title });
    if (blogExist) {
      return NextResponse.json({
        success: false,
        message: messages.addBlog.BLOG_EXIST,
      });
    }

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
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.addBlog.ERROR,
    });
  }
}

// blog-by-category
export async function GET(req) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const categoryItem = searchParams.get("category");

  if (!categoryItem) {
    return NextResponse.json({
      success: false,
      message: messages.blogByCategory.NO_CATEGORY,
    });
  }

  try {
    const blogs = await Blog.find({
      category: { $elemMatch: { $regex: categoryItem, $options: "i" } },
    });

    if (blogs) {
      return NextResponse.json({
        success: true,
        message: messages.blogByCategory.SUCCESS,
        data: blogs,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: messages.blogByCategory.NO_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: messages.blogByCategory.ERROR,
    });
  }
}

// update blog
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
