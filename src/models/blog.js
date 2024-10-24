import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
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
