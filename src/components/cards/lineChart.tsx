import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Types
interface PriorityStateData {
  totalCount: number;
  open: number;
  inProgress: number;
  closed: number;
  onHold: number;
  reopen: number;
  resolved: number;
}

interface IncidentPrioritySummary {
  priority: Record<string, PriorityStateData[]>;
  totalAverageResolvedTime: string;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const stateColors: Record<string, string> = {
  Open: "#FC7E80",
  "In progress": "#ECCF5C",
  "On-Hold": "#A291FD",
  Closed: "#4FDBF5",
  Resolved: "#53D7B6",
  Reopen: "#FC88F0",
};

const LineChart: React.FC<{ appliedFilters?: any }> = ({ appliedFilters }) => {
  const chartRef = useRef<any>(null);
  const [gradient, setGradient] = useState<string | CanvasGradient>(
    "rgba(73, 85, 85, 0.2)"
  );
  const [incidentPrioritySummary, setIncidentPrioritySummary] =
    useState<IncidentPrioritySummary | null>(null);

  // ------------------ 🎯 Fetch API Data ------------------
  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const query = appliedFilters ? `?${appliedFilters}` : "";
        const url = `http://localhost:5092/api/Incident/countbypriority${query}`;
        console.log("LineURL:", url);

        const response = await fetch(url);
        const data: IncidentPrioritySummary = await response.json();
        setIncidentPrioritySummary(data);
      } catch (error) {
        console.error("Error fetching incident summary:", error);
        setIncidentPrioritySummary(null);
      }
    };

    fetchIncidentSummary();
  }, [appliedFilters]);

  // ------------------ 🎨 Set Gradient ------------------
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
      gradientFill.addColorStop(0, "#4d4d5575");
      gradientFill.addColorStop(1, "#ffffff10");
      setGradient(gradientFill);
    }
  }, []);

  // ------------------ 🧩 Transform API Data ------------------
  const targetPriority = "3 - Moderate"; // or dynamically from props
  const priorityData = incidentPrioritySummary?.priority?.[targetPriority]?.[0];

  const stateCountMap: Record<string, number> = priorityData
    ? {
        Open: priorityData.open,
        "In progress": priorityData.inProgress,
        "On-Hold": priorityData.onHold,
        Closed: priorityData.closed,
        Resolved: priorityData.resolved,
        Reopen: priorityData.reopen,
      }
    : {};

  const labels = Object.keys(stateCountMap);
  const values = Object.values(stateCountMap);
  const pointColors = labels.map((state) => stateColors[state] || "#000");

  // ------------------ 📊 Chart Data ------------------
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "grey",
        backgroundColor: gradient,
        fill: true,
        borderWidth: 0.2,
        tension: 0,
        pointBackgroundColor: pointColors,
        pointHoverBorderColor: "black",
        pointHoverBorderWidth: 4,
        pointRadius: 8,
        pointHoverRadius: 7,
        pointBorderColor: "#fff",
        pointBorderWidth: 4,
      },
    ],
  };

  // ------------------ ⚙️ Chart Options ------------------
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: "easeOutQuad",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        cornerRadius: 12,
        padding: { top: 8, bottom: 8, left: 16, right: 16 },
        bodySpacing: 20,
        boxPadding: 15,
        backgroundColor: "black",
        titleFont: { size: 0 },
        bodyFont: { size: 14, weight: "normal" },
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: () => "",
          label: (context) =>
            `${context.label}: ${context.formattedValue}`,
          labelTextColor: () => "#ffffff80",
          labelColor: (context) => {
            const dataset = context.dataset as any;
            const color =
              (dataset.pointBackgroundColor as string[])[context.dataIndex] ||
              "#000";
            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 10,
              pointStyle: "circle",
            };
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { display: false, beginAtZero: true, grid: { display: false } },
    },
  };

  if (!incidentPrioritySummary) {
    return <p style={{ color: "#999" }}>Loading incident summary...</p>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default LineChart;
