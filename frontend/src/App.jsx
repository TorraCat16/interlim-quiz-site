import React from "react";
import Quiz from "./Components/Quiz/Quiz";
import { useAuth } from "./AuthContext";
import Login from "./Components/Auth/Login";

const App = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ fontWeight: 600 }}>Quiz app</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#333" }}>
            Signed in as <strong>{user.username}</strong> ({user.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <Quiz />
    </>
  );
}

export default App