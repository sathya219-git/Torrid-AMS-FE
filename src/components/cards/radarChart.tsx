// RadarChart.tsx
import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Radar chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = {
  labels: ["Strength", "Speed", "Endurance", "Agility", "Flexibility", "Skill"],
  datasets: [
    {
      data: [28, 48, 40, 19, 96, 27],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",

      // Set individual point colors for each label
      pointBackgroundColor: [
        "#FF7A9C", // Strength
        "#FCD469", // Speed
        "#6ED5E1", // Endurance
        "#A99CF0", // Agility
        "#FFB8D2", // Flexibility
        "#69D2B7", // Skill
      ],
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};

const RadarChart: React.FC = () => {
  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
