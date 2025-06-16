import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import ClassSession from "../models/ClassSession.js";

export const joinClassroom = async (req, res) => {
  const { roomId, userId, sessionId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found");

  let classroom = await Classroom.findOneAndUpdate(
    { roomId },
    { $setOnInsert: { roomId } },
    { new: true, upsert: true }
  );

  if (user.role === "student" && !classroom.isLive)
    return res.status(403).send("Class hasn't started");

  if (user.role === "teacher") {
    classroom.teacherList.addToSet(user._id);
  } else {
    classroom.studentList.addToSet(user._id);
  }

  await classroom.save();

  await ClassSession.findByIdAndUpdate(sessionId, {
    $push: {
      participants: {
        user: user._id,
        role: user.role,
        joinedAt: new Date(),
      },
    },
  });

  
  classroom = await classroom
    .populate("teacherList", "name")
    .populate("studentList", "name");

  res.json({
    isLive: classroom.isLive,
    teacherList: classroom.teacherList.map((u) => u.name),
    studentList: classroom.studentList.map((u) => u.name),
  });
};

export const leaveClassroom = async (req, res) => {
  const { roomId, userId, sessionId } = req.body;
  const classroom = await Classroom.findOne({ roomId });
  if (!classroom) return res.status(404).send("Classroom not found");

  classroom.teacherList.pull(userId);
  classroom.studentList.pull(userId);
  await classroom.save();

  await ClassSession.updateOne(
    { _id: sessionId, "participants.user": userId },
    { $set: { "participants.$.leftAt": new Date() } }
  );

  res.send({ message: "User left" });
};

export const startClass = async (req, res) => {
  const { roomId } = req.body;

  const classroom = await Classroom.findOne({ roomId });
  if (!classroom) return res.status(404).send("Room not found");

  classroom.isLive = true;
  await classroom.save();

  const session = await ClassSession.create({
    roomId,
    startTime: new Date(),
    participants: [],
  });

  res.send({ message: "Class started", sessionId: session._id });
};

export const endClass = async (req, res) => {
  const { roomId, sessionId } = req.body;
  const classroom = await Classroom.findOne({ roomId });
  if (!classroom) return res.status(404).send("Room not found");

  classroom.isLive = false;
  classroom.teacherList = [];
  classroom.studentList = [];
  await classroom.save();

  await ClassSession.findByIdAndUpdate(sessionId, { endTime: new Date() });

  res.send({ message: "Class ended" });
};

export const getReport = async (req, res) => {
  const { roomId } = req.params;
  const logs = await ClassSession.find({ roomId })
    .populate("participants.user", "name role")
    .sort({ startTime: -1 });

  res.send(logs);
};
