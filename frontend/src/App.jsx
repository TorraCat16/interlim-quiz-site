import React from "react";
import Quiz from "./Components/Quiz/Quiz";
import { useAuth } from "./AuthContext";
import Login from "./Components/Auth/Login";

const App = () => {
  const { user, token, logout } = useAuth();

  const createDummyQuiz = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: `Quiz ${new Date().toLocaleString()}`,
          questions: [
            {
              question: "2+2?",
              option1: "3",
              option2: "4",
              option3: "5",
              option4: "6",
              ans: 2
            }
          ]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      alert(`Quiz created (id: ${data.id})`);
    } catch (e) {
      alert(`Failed to create quiz: ${e.message}`);
    }
  };

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
          {user.role === "teacher" && (
            <button onClick={createDummyQuiz}>Add quiz</button>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <Quiz />
    </>
  );
}

export default App