import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    birth: { type: Date, required: true },
    gender: { type: String, enum: ["Nam", "Nữ"], required: true },
    phone: {
      type: String,
      required: true,
      index: true,
      match: [/^0\d{9}$/, "Số điện thoại không hợp lệ!"],
    },
    imageUrl: { type: String },
    address: { type: String, required: true },
    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
    },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    expiredDate: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required : true,
    }
  },
  { timestamps: true }
);

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;
