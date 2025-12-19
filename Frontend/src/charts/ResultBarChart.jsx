import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ResultBarChart = ({ correct, incorrect, notAttempted }) => {
  const data = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
    { name: "Not Attempted", value: notAttempted },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#0d6efd" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultBarChart;
