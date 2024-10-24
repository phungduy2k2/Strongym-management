import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
