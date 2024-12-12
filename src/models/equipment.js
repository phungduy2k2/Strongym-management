import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Số lượng phải là số không âm."],
      validate: {
        validator: Number.isInteger,
        message: "Số lượng phải là một số nguyên."
      }
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nextMaintenanceDate: { type: Date },
  },
  { timestamps: true }
);

const Equipment =
  mongoose.models.Equipment || mongoose.model("Equipment", EquipmentSchema);

export default Equipment;
