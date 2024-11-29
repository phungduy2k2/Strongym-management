import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    birth: { type: Date, required: true },
    phone: {
      type: String,
      required: true,
      index: true,
      match: [/^0\d{9}$/, "Số điện thoại không hợp lệ!"],
    },
    gender: { type: String, enum: ["male", "female"], required: true },
    imageUrl: { type: String, required: true },
    idCard: {
      type: String,
      required: true,
      match: [/^\d{9,12}$/, "CCCD không hợp lệ!"],
    },
    address: { type: String, required: true },
    position: {
      type: String,
      enum: ["manager", "trainer", "security", "receptionist", "cleanor"],
      required: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;
