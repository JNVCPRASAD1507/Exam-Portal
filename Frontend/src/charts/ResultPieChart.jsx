import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107"];

const ResultPieChart = ({ correct, incorrect, notAttempted }) => {
  const data = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
    { name: "Not Attempted", value: notAttempted },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ResultPieChart;
