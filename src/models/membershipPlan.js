import mongoose from "mongoose";

const MembershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 200 },
  },
  { timestamps: true },
);

const MembershipPlan = mongoose.models.MembershipPlan || mongoose.model("MembershipPlan", MembershipPlanSchema);

export default MembershipPlan;
