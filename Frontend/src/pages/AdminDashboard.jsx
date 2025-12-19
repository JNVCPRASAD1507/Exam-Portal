import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const { api, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await api.get("/admin/students");
        setStudents(studentRes.data);

        const resultsRes = await api.get("/admin/results");
        // Populate student roll numbers
        const resultsWithRollNo = resultsRes.data.map((r) => {
          const student = studentRes.data.find((s) => s._id === r.student);
          return { ...r, rollNo: student?.rollNo || "Unknown" };
        });
        setResults(resultsWithRollNo);
      } catch (err) {
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  // Prepare chart data
  const chartData = students.map((s) => {
    const studentResults = results.filter((r) => r.rollNo === s.rollNo);
    const avgScore =
      studentResults.length > 0
        ? studentResults.reduce((acc, r) => acc + r.score, 0) / studentResults.length
        : 0;
    return { rollNo: s.rollNo, averageScore: avgScore };
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </div>

      <h4>Students</h4>
      <ul className="list-group mb-4">
        {students.map((s) => (
          <li key={s._id} className="list-group-item">
            {s.rollNo}
          </li>
        ))}
      </ul>

      <h4>Results</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Score</th>
            <th>Total</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th>Not Attempted</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.rollNo}</td>
              <td>{r.score}</td>
              <td>{r.total}</td>
              <td>{r.correct}</td>
              <td>{r.wrong}</td>
              <td>{r.notAttempted}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-5">Average Scores Chart</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="rollNo" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="averageScore" fill="#198754" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminDashboard;
