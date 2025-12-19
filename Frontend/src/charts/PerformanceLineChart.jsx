import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PerformanceLineChart = ({ results }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={results}>
      <XAxis dataKey="testName" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="score" stroke="#198754" />
    </LineChart>
  </ResponsiveContainer>
);

export default PerformanceLineChart;
