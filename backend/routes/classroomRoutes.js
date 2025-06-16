import express from "express";
import {
  joinClassroom,
  leaveClassroom,
  startClass,
  endClass,
  getReport
} from "../controllers/classroomController.js";

const router = express.Router();

router.post("/join", joinClassroom);
router.post("/leave", leaveClassroom);
router.post("/start", startClass);
router.post("/end", endClass);
router.get("/report/:roomId", getReport);

export default router;
