import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Classroom from "./components/Classroom";
import ReportViewer from "./components/ReportViewer";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">LIVE Virtual Classroom</h1>
        <Routes>
          <Route
            path="/"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/classroom" />}
          />
          <Route
            path="/classroom"
            element={user ? <Classroom user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/report"
            element={
              user && user.role === "manager" ? (
                <ReportViewer />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
