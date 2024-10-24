import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['manager', 'member'], default: 'member'},
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
