import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: [
      {
        type: { type: String, enum: ["text", "image", "video"], required: true },
        data: { type: String, required: true }, // `data` chứa văn bản, URL ảnh hoặc URL video
        metadata: {
          caption: { type: String, trim: true },
          resolution: { type: String }, // Độ phân giải ảnh/video
          size: { type: Number } // kích thước file
        },
        _id: false
      }
    ],
    category: [{ type: String, trim: true }],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
