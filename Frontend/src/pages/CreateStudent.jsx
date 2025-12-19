import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CreateStudent = () => {
  const { api } = useAuth();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rollNo.trim() || !password.trim()) {
      setMsg("Roll Number and Password are required.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/admin/create-student", {
        rollNo: rollNo.trim(),
        password: password.trim(),
      });

      setMsg(res.data.message || "Student created successfully!");
      setRollNo("");
      setPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Student</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
};

export default CreateStudent;
