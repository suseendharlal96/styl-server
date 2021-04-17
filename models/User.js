import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    profile: { type: String },
    s3Key: { type: String },
  },
  // adds createdAt and updatedAt automatically
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
