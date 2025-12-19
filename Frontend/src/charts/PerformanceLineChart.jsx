import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PerformanceLineChart = ({ results }) => {
  // results = [{ testName: "Test 1", score: 5 }, ...]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={results}>
        <XAxis dataKey="testName" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#198754" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceLineChart;
