import { useEffect, useState } from "react";
import io from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:5000");

export default function Classroom({ user }) {
  const [roomId] = useState("room101");
  const [sessionId, setSessionId] = useState(null);
  const [teacherList, setTeacherList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    socket.emit("join-room", { roomId, user });

    API.post("/join", { roomId, userId: user.id, sessionId })
      .then((res) => {
        setIsLive(res.data.isLive);
        setTeacherList(res.data.teacherList || []);
        setStudentList(res.data.studentList || []);
      })
      .catch((err) => {

        if (
          user.role === "student" &&
          err.response &&
          err.response.status === 403
        ) {
          alert("Class hasn't started yet. Please wait for the teacher to start the class.");
          
        } else {
          console.error(err);
        }
      });

    return () => {
      socket.emit("leave-room", { roomId, user });
      API.post("/leave", { roomId, userId: user.id, sessionId });
    };
  }, []);

  useEffect(() => {
    socket.on("update-participants", ({ user, action }) => {
      if (user.role === "teacher") {
        setTeacherList((prev) =>
          action === "joined" ? [...prev, user.name] : prev.filter((n) => n !== user.name)
        );
      } else {
        setStudentList((prev) =>
          action === "joined" ? [...prev, user.name] : prev.filter((n) => n !== user.name)
        );
      }
    });
  }, []);

  const startClass = async () => {
    const res = await API.post("/start", { roomId });
    setSessionId(res.data.sessionId);
    setIsLive(true);
  };

  const endClass = async () => {
    await API.post("/end", { roomId, sessionId });
    setSessionId(null);
    setTeacherList([]);
    setStudentList([]);
    setIsLive(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Live Classroom: {roomId}</h2>

      {isLive ? (
        <div className="mb-4 text-green-700 font-bold">Classroom is LIVE</div>
      ) : (
        <div className="mb-4 text-gray-500">Classroom is not live</div>
      )}

      {user.role === "teacher" && (
        <div className="flex gap-4 mb-4">
          <button onClick={startClass} className="bg-green-600 text-white px-4 py-2 rounded">
            Start Class
          </button>
          <button onClick={endClass} className="bg-red-600 text-white px-4 py-2 rounded">
            End Class
          </button>
        </div>
      )}

      {user.role === "manager" && (
        <a href="/report" className="text-blue-600 underline">View Classroom Report</a>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold">Teachers:</h3>
          <ul>{teacherList.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
        <div>
          <h3 className="text-xl font-bold">Students:</h3>
          <ul>{studentList.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
