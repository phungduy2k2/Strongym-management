import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    creatorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    },
    nextMaintenanceDate: { type: Date, required: false },
  },
  { timestamps: true },
);

const Equipment = mongoose.models.Equipment || mongoose.model("Equipment", EquipmentSchema);

export default Equipment;
