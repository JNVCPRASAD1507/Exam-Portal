import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import ResultBarChart from "../charts/ResultBarChart";
import ResultPieChart from "../charts/ResultPieChart";
// import PerformanceLineChart from "../charts/PerformanceLineChart";

const TakeTest = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [score, setScore] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [notAttempted, setNotAttempted] = useState(0);

  const [faceWarnings, setFaceWarnings] = useState(0);

  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const faceDetectionRef = useRef(null);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setQuestions(res.data);
        setTimeLeft(res.data.length * 10);
      })
      .catch(() => alert("Failed to load questions"));
  }, [user.token]);

  /* ================= FULLSCREEN ================= */
  useEffect(() => {
    document.documentElement.requestFullscreen?.();
  }, []);

  /* ================= CAMERA + FACE DETECTION ================= */
  useEffect(() => {
    if (submitted || !videoRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      const faces = results.detections?.length || 0;

      if (faces === 0) {
        setFaceWarnings((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            alert("Face not detected multiple times. Exam submitted.");
            submitTest();
          }
          return next;
        });
      }

      if (faces > 1) {
        alert("Multiple faces detected! Exam submitted.");
        submitTest();
      }
    });

    faceDetectionRef.current = faceDetection;

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      camera.stop();
    };
  }, [submitted]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      alert("Time up! Exam submitted.");
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* ================= SECURITY ================= */
  useEffect(() => {
    if (submitted) return;

    const breach = (msg) => {
      alert(msg);
      submitTest();
    };

    const handleBlur = () => breach("Tab switch detected!");
    const handleVisibility = () => document.hidden && handleBlur();
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" ||
        e.key === "F12" ||
        e.key === "F5" ||
        (e.ctrlKey && e.key.toLowerCase() === "r")
      ) {
        e.preventDefault();
        breach("Restricted action detected!");
      }
    };

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) breach("Exited fullscreen!");
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [submitted]);

  /* ================= ANSWERS ================= */
  const handleAnswerChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  /* ================= SUBMIT ================= */
  const submitTest = () => {
    if (submitted) return;

    setSubmitted(true);
    cameraRef.current?.stop();

    let correct = 0,
      wrong = 0,
      notAns = 0;

    questions.forEach((q, i) => {
      if (!answers[i]) notAns++;
      else if (answers[i] === q.correctAnswer) correct++;
      else wrong++;
    });

    setScore(correct);
    setIncorrect(wrong);
    setNotAttempted(notAns);

    axios.post(
      "http://localhost:5000/api/student/submit",
      { correct, wrong, notAttempted: notAns, total: questions.length },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      {!submitted && (
        <div className="position-fixed top-0 end-0 m-3 border rounded shadow">
          <video ref={videoRef} autoPlay muted width="160" />
        </div>
      )}

      <div className="card shadow-lg p-4">
        {!submitted ? (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Online Examination</h3>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
              </button>
            </div>

            <div className="text-center text-danger fw-bold my-3">
              Time Left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
            </div>

            {faceWarnings > 0 && (
              <div className="alert alert-warning text-center">
                Face not detected ({faceWarnings}/3)
              </div>
            )}

            {questions.map((q, i) => (
              <div key={i} className="mb-4">
                <p className="fw-bold">
                  Q{i + 1}. {q.question}
                </p>
                {q.options.map((op, j) => (
                  <div key={j} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === op}
                      onChange={() => handleAnswerChange(i, op)}
                    />
                    <label className="form-check-label">{op}</label>
                  </div>
                ))}
              </div>
            ))}

            <button className="btn btn-primary w-100" onClick={submitTest}>
              Submit Test
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-success">
                Score: {score}/{questions.length}
              </h3>
              <p>Correct: {score}</p>
              <p className="text-danger">Incorrect: {incorrect}</p>
              <p className="text-warning">Not Attempted: {notAttempted}</p>
            </div>
            {submitted && (
              <div className="text-center">
                <h3 className="text-success mb-4">
                  Score: {score}/{questions.length}
                </h3>

                <div className="row">
                  <div className="col-md-6">
                    <ResultPieChart
                      correct={score}
                      incorrect={incorrect}
                      notAttempted={notAttempted}
                    />
                  </div>

                  <div className="col-md-6">
                    <ResultBarChart
                      correct={score}
                      incorrect={incorrect}
                      notAttempted={notAttempted}
                    />
                  </div>
                </div>
              </div>
            )}

              <PerformanceLineChart results={results} />

          </>
        )}
      </div>
    </div>
  );
};

export default TakeTest;
