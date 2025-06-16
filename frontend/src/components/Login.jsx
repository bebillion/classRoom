import { useState } from "react";
import API from "../services/api";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role }),
      });
      const user = await res.json();

      if (role !== "manager") {
        try {
          const joinRes = await API.post("/join", {
            roomId: "room101",
            userId: user._id,
            sessionId: null,
          });
          
          setUser({ id: user._id, name: user.name, role: user.role });
        } catch (err) {
          if (
            role === "student" &&
            err.response &&
            err.response.status === 403
          ) {
            alert("Class hasn't started yet. Please wait for the teacher to start the class.");
            return;
          }
          alert("Failed to join classroom.");
          return;
        }
      } else {
        setUser({ id: user._id, name: user.name, role: user.role });
      }
    } catch (err) {
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        className="border p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2">
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
        <option value="manager">Manager</option>
      </select>
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Enter Classroom
      </button>
    </div>
  );
}
