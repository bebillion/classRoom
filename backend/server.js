import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server as SocketIO } from "socket.io";
import classroomRoutes from "./routes/classroomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import socketHandler from "./socket.js";
import { MONGODB_URI } from "./config.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: { origin: "*" },
});

socketHandler(io);

app.use(cors());
app.use(express.json());

app.use("/api/classroom", classroomRoutes);
app.use("/api", userRoutes);

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

server.listen(5000, () => console.log("Server running on port 5000"));
