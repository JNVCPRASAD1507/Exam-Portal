import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import ResultBarChart from "../charts/ResultBarChart";
import ResultPieChart from "../charts/ResultPieChart";

const TakeTest = () => {
  const { api, logout } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [result, setResult] = useState(null);
  const [faceWarnings, setFaceWarnings] = useState(0);

  const videoRef = useRef(null);
  const cameraRef = useRef(null);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    api.get("/questions")
      .then((res) => {
        setQuestions(res.data);
        setTimeLeft(res.data.length * 60); // 1 min per question
      })
      .catch(() => alert("Failed to load questions"));
  }, [api]);

  /* ================= FULLSCREEN ================= */
  useEffect(() => {
    document.documentElement.requestFullscreen?.();
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* ================= FACE DETECTION ================= */
  useEffect(() => {
    if (submitted || !videoRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({ model: "short", minDetectionConfidence: 0.6 });

    faceDetection.onResults((results) => {
      const faces = results.detections?.length || 0;

      if (faces !== 1) {
        setFaceWarnings((prev) => {
          const next = prev + 1;
          if (next >= 3) submitTest();
          return next;
        });
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () =>
        await faceDetection.send({ image: videoRef.current }),
    });

    camera.start();
    cameraRef.current = camera;

    return () => camera.stop();
  }, [submitted]);

  /* ================= ANSWERS ================= */
  const handleAnswerChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  /* ================= SUBMIT ================= */
  const submitTest = async () => {
    if (submitted) return;

    setSubmitted(true);
    cameraRef.current?.stop();

    try {
      const res = await api.post("/student/submit", {
        answers,
        total: questions.length,
      });

      setResult(res.data);
    } catch {
      alert("Failed to submit test");
    }
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
        <div className="position-fixed top-0 end-0 m-3 border rounded">
          <video ref={videoRef} autoPlay muted width="160" />
        </div>
      )}

      <div className="card shadow p-4">
        {!submitted ? (
          <>
            <div className="d-flex justify-content-between">
              <h3>Online Examination</h3>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>

            <div className="text-danger text-center fw-bold my-3">
              Time Left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
            </div>

            {faceWarnings > 0 && (
              <div className="alert alert-warning text-center">
                Face warnings: {faceWarnings}/3
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
                      type="radio"
                      className="form-check-input"
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
          result && (
            <>
              <h3 className="text-success text-center">
                Score: {result.score}/{questions.length}
              </h3>

              <div className="row mt-4">
                <div className="col-md-6">
                  <ResultPieChart {...result} />
                </div>
                <div className="col-md-6">
                  <ResultBarChart {...result} />
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default TakeTest;
