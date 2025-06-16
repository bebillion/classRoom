import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  isLive: { type: Boolean, default: false },
  teacherList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  studentList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Classroom", classroomSchema);
