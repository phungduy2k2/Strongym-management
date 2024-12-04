import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: ["VND", "USD", "EUR"],
      default: "VND",
      required: true,
    },
    description: { type: String, required: true },
    status: { type: String, enum: ["UPCOMING", "ACTIVE", "EXPIRED"], default: "UPCOMING" },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
