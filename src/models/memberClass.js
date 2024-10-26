import mongoose from "mongoose";

// collection phụ lk 2 collection Member và Class
const MemberClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
    registrationDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const MemberClass = mongoose.models.MemberClass || mongoose.model("MemberClass", MemberClassSchema);

export default MemberClass;
