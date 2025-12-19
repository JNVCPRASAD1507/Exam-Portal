import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const PrepareTest = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("testQuestions")) || [];
    setQuestions(storedData);
  }, []);

  const handleOptionChange = (index, value) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  await axios.post(
    "http://localhost:5000/api/questions",
    { question, options, correctAnswer },
    {
      headers: { Authorization: `Bearer ${user.token}` },
    }
  );

  setQuestion("");
  setOptions(["", "", "", ""]);
  setCorrectAnswer("");
};

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newQuestion = { question, options, correctAnswer };
  //   const updatedQuestions = [...questions, newQuestion];
  //   localStorage.setItem("testQuestions", JSON.stringify(updatedQuestions));
  //   setQuestions(updatedQuestions);
  //   setQuestion("");
  //   setOptions(["", "", "", ""]);
  //   setCorrectAnswer("");
  // };
 



const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Prepare Test</h1>
      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          <div className="mb-3">
            <label className="form-label fw-bold">Enter Question</label>
            <textarea
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          {[...Array(4)].map((_, i) => (
            <div className="mb-3" key={i}>
              <label className="form-label">Option {i + 1}</label>
              <input
                type="text"
                className="form-control"
                value={options[i]}
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
          <button type="submit" className="btn btn-primary w-50">
            Submit Question
          </button>
        </form>
      </div>

      <h2 className="text-center mt-5">Test Questions</h2>
      <ul className="list-group mt-3">
        {questions.map((item, index) => (
          <li className="list-group-item" key={index}>
            <strong>Q{index + 1}:</strong> {item.question}
            <ul className="mt-2">
              {item.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
            <strong className="text-success">Correct Answer:</strong>{" "}
            {item.correctAnswer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrepareTest;
