import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateStudent = () => {
  const { user } = useAuth();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/create-student",
        { rollNo, password },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg(res.data.message);
      setRollNo("");
      setPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary">Create</button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
};

export default CreateStudent;