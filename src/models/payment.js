import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    memberId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    },
    membershipPlanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "MembershipPlan"
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    paymentMethod: {type: String, enum: ['cash', 'card', 'stripe'], default: 'stripe' },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
