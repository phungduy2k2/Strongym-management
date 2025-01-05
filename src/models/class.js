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
    maxStudent: { type: Number, required: true, min: 1 },
    memberIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
      }
    ],
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
    schedule: [
      {
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    approvalStatus: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
