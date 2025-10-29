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
import { useAtomValue } from "jotai";
import { appliedFilter } from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";

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

interface PriorityStats {
  totalCount: number;
  open: number;
  inProgress: number;
  closed: number;
  onHold: number;
  reopen: number;
  resolved: number;
}

interface IncidentPrioritySummary {
  priority: Record<string, PriorityStats[]>;
  totalAverageResolvedTime: string;
}

const LineChart: React.FC = () => {
  const appliedFilters = useAtomValue(appliedFilter);
  const [incidentPrioritySummary, setIncidentPrioritySummary] =
    useState<IncidentPrioritySummary | null>(null);

  const chartRef = useRef<any>(null);
  const [gradient, setGradient] = useState<string | CanvasGradient>(
    "rgba(73, 85, 85, 0.2)"
  );

  // Fetch API data
  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        const url = query
          ? `http://localhost:5092/api/Incident/countbypriority?${query}`
          : `http://localhost:5092/api/Incident/countbypriority`;

        console.log("Line URL:", url);

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

  // Set gradient
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

  // 🔹 Prepare chart data dynamically from API response
  let labels: string[] = [];
  let values: number[] = [];
  let pointColors: string[] = [];

  if (incidentPrioritySummary?.priority) {
    const p3Data = incidentPrioritySummary.priority["3 - Moderate"]?.[0];
    if (p3Data) {
      const stateCountMap: Record<string, number> = {
        Open: p3Data.open,
        "In progress": p3Data.inProgress,
        "On-Hold": p3Data.onHold,
        Closed: p3Data.closed,
        Resolved: p3Data.resolved,
        Reopen: p3Data.reopen,
      };

      labels = Object.keys(stateCountMap);
      values = Object.values(stateCountMap);
      pointColors = labels.map((state) => stateColors[state] || "#000");
    }
  }

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

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: "easeOutQuad",
    },
    layout: {
      padding: { top: 10, left: 0, right: 0, bottom: 0 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        cornerRadius: 12,
        padding: { top: 8, bottom: 8, left: 16, right: 16 },
        bodySpacing: 20,
        boxPadding: 15,
        enabled: true,
        backgroundColor: "black",
        titleFont: { size: 0 },
        bodyFont: { size: 14, weight: "normal" },
        displayColors: true,
        usePointStyle: true,
        boxWidth: 5,
        boxHeight: 5,
        callbacks: {
          title: () => "",
          label: (context) => `${context.label}: ${context.formattedValue}`,
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
    elements: {
      point: {
        radius: 7,
        hoverRadius: 10,
        borderWidth: 1,
        hoverBorderWidth: 4,
        borderColor: "#fff",
        hoverBorderColor: "black",
      },
      line: { borderWidth: 0.5 },
    },
    clip: false,
    scales: {
      x: { grid: { display: false }, ticks: { padding: 0 } },
      y: {
        display: false,
        beginAtZero: true,
        grid: { display: false },
        ticks: { padding: 0 },
      },
    },
    hover: { mode: "nearest", intersect: true },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {incidentPrioritySummary ? (
        <Line ref={chartRef} data={data} options={options} />
      ) : (
        <p style={{ textAlign: "center", color: "#999" }}>Loading data...</p>
      )}
    </div>
  );
};

export default LineChart;
