import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: ["USD", "EUR", "VND"],
      required: true,
      default: "VND",
    },
    description: { type: String, required: true },
    status: { type: String, enum: ["active", "expired"], default: "expired" },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
