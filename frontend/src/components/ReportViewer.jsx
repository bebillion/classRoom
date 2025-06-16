import { useEffect, useState } from "react";
import API from "../services/api";

export default function ReportViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/report/room101").then((res) => setLogs(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Classroom Report</h2>
      {logs.map((session, index) => (
        <div key={index} className="border p-3 mb-4">
          <p><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</p>
          <p><strong>End:</strong> {session.endTime ? new Date(session.endTime).toLocaleString() : "Ongoing"}</p>
          <h4 className="font-bold mt-2">Participants:</h4>
          <ul>
            {session.participants.map((p, i) => (
              <li key={i}>
                {p.user.name} ({p.role}) - Joined: {new Date(p.joinedAt).toLocaleString()}, Left:{" "}
                {p.leftAt ? new Date(p.leftAt).toLocaleString() : "Still in"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
