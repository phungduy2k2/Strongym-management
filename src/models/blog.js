import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: [
      {
        type: { type: String, enum: ["text", "image", "video"], required: true },
        data: { type: String, required: true } // `data` chứa văn bản, URL ảnh hoặc URL video
      }
    ],
    category: [{ type: String }],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
},
  { timestamps: true }
);

const Blog =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
