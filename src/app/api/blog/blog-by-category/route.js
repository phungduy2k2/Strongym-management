import connectToDB from "@/database";
import Blog from "@/models/blog";
import { messages } from "@/utils/message";

export const dynamic = "force-dynamic";

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
