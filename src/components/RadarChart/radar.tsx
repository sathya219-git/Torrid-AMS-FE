import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Chart data
const data = {
  labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: "rgba(235, 90, 54, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(54, 162, 235, 1)",
    },
  ],
};

// Chart options (optional)
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: "#ccc" },
      grid: { color: "#ddd" },
      pointLabels: { color: "#333", font: { size: 14 } },
      ticks: { display: false },
    },
  },
  plugins: {
    legend: {
      display: true,
      labels: { color: "#000" },
    },
  },
};

export default function App() {
  return (
    <div style={{ width: "500px", height: "500px", margin: "auto" }}>
      <Radar data={data} options={options} />
    </div>
  );
}
