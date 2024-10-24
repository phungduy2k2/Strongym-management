import mongoose from "mongoose";

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
