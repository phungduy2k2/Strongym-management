import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birth: { type: Date, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String, required: true },
    idCard: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;
