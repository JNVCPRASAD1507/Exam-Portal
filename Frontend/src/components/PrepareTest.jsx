import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PrepareTest = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const { api, logout } = useAuth();
  const navigate = useNavigate();

  // Admin logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle options
  const handleOptionChange = (index, value) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Submit question to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || options.some((o) => !o) || !correctAnswer) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await api.post("/questions", {
        question,
        options,
        correctAnswer,
      });

      alert("Question added successfully");

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      alert("Error adding question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Prepare Test (Admin)</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <div className="card p-4 shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Question</label>
            <textarea
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {options.map((opt, i) => (
            <div className="mb-3" key={i}>
              <label className="form-label">Option {i + 1}</label>
              <input
                type="text"
                className="form-control"
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label fw-bold">Correct Answer</label>
            <input
              type="text"
              className="form-control"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrepareTest;
