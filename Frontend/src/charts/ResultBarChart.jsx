import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ResultBarChart = ({ correct, incorrect, notAttempted }) => {
  const data = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
    { name: "Not Attempted", value: notAttempted },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#198754" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultBarChart;
