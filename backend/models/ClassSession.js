import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: String,
      joinedAt: Date,
      leftAt: Date,
    },
  ],
});

export default mongoose.model("ClassSession", classSessionSchema);
