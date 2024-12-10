import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    amount: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: ["VND", "USD", "EUR"],
      default: "VND",
      required: true,
    },
    description: { type: String, required: true, maxlength: 200 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "stripe"],
      default: "stripe",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
