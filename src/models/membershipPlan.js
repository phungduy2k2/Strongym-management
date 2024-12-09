import mongoose from "mongoose";

const MembershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    total_member: { type: Number, required: true },
  },
  { timestamps: true },
);

const MembershipPlan = mongoose.models.MembershipPlan || mongoose.model("MembershipPlan", MembershipPlanSchema);

export default MembershipPlan;
