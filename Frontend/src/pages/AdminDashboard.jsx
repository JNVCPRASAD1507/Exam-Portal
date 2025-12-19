import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setStudents(res.data));

    axios
      .get("http://localhost:5000/api/admin/results", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setResults(res.data));
  }, [user]);

  return (
    <>
      <div className="container mt-4">
        <h2>Admin Dashboard</h2>

        <h4 className="mt-4">Students</h4>
        <ul className="list-group">
          {students.map((s) => (
            <li key={s._id} className="list-group-item">
              {s.rollNo}
            </li>
          ))}
        </ul>

        <h4 className="mt-4">Results</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Score</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.studentRollNo}</td>
                <td>{r.score}</td>
                <td>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BarChart width={600} height={300} data={students}>
        <XAxis dataKey="rollNumber" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="averageScore" />
      </BarChart>
    </>
  );
};

export default AdminDashboard;
