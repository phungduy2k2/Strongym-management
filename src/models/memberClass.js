import mongoose from "mongoose";

// collection phụ lk 2 collection Member và Class
const MemberClassSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
  },
  { timestamps: true }
);

const MemberClass = mongoose.models.MemberClass || mongoose.model("MemberClass", MemberClassSchema);

export default MemberClass;
