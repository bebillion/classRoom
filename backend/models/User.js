import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ["teacher", "student", "manager"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
