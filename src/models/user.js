import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, //id của tài khoản Clerk
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['manager', 'member'], default: 'member'},
    memberId: { //id của Member tương ứng với User này
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
