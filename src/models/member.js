import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birth: { type: Date, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    membershipPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MembershipPlan",
    },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    expiredDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;
