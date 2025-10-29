import React, { useEffect, useState } from "react";
import "./IncidentChart.css";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { appliedFilter } from "../../store/filterStore";
import { useAtomValue } from "jotai";
import { Group, Text, Box, Stack, Paper } from "@mantine/core";

// --- Data Structure Definitions ---
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

interface IncidentStateData {
  state: string;
  count: number;
  color: string;
}

// --- Utility to Build Chart Data from API Response ---
const buildIncidentChartData = (
  stats: PriorityStats
): { data: IncidentStateData[]; totalCount: number; maxCount: number } => {
  const stateCounts: Record<string, number> = {
    Open: stats.open,
    "In progress": stats.inProgress,
    Closed: stats.closed,
    "On-Hold": stats.onHold,
    Reopen: stats.reopen,
    Resolved: stats.resolved,
  };

  const stateColors: Record<string, string> = {
    Open: "#FC7E80",
    "In progress": "#ECCF5C",
    "On-Hold": "#A291FD",
    Closed: "#4FDBF5",
    Resolved: "#53D7B6",
    Reopen: "#FC88F0",
  };

  const totalCount = stats.totalCount;
  const maxCount = Math.max(...Object.values(stateCounts), 1);

  const chartData: IncidentStateData[] = Object.keys(stateCounts).map(
    (state) => ({
      state,
      count: stateCounts[state],
      color: stateColors[state],
    })
  );

  return { data: chartData, totalCount, maxCount };
};

// --- React Component ---
const IncidentChart: React.FC = () => {
  const appliedFilters = useAtomValue(appliedFilter);
  const [incidentPrioritySummary, setIncidentPrioritySummary] =useState<IncidentPrioritySummary | null>(null);

  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        const url = query
          ? `http://localhost:5092/api/Incident/countbypriority?${query}`
          : `http://localhost:5092/api/Incident/countbypriority`;

        console.log("Incident URL:", url);

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

  // --- Handle Loading or Empty Data ---
  if (!incidentPrioritySummary)
    return <div>Loading incident priority summary...</div>;

  // Example: Pick a specific priority (say, “2 - High”)
  const priorityKey = "1 - Critical";
  const priorityData = incidentPrioritySummary.priority[priorityKey]?.[0];

  if (!priorityData)
    return <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Stack gap="md" align="center" w={200} h={200}>
        <Text c="dimmed" ta="center">
          No incidents found for the selected priority.
        </Text>
      </Stack>
      {/* {priorityKey} */}
      </div>;

  // --- Build Chart Data for That Priority ---
  const { data, totalCount, maxCount } = buildIncidentChartData(priorityData);

  return (
    <div className="incident-chart-container">
      <h2 className="chart-title">
        {priorityKey} ({totalCount})
      </h2>

      <div className="bar-chart">
        {data.map((item, index) => (
          <div className="bar-column" key={index}>
            <div className="bar-count">{item.count}</div>
            <div
              className="bar"
              style={{
                height: `${(item.count / maxCount) * 100}%`,
                backgroundColor: item.color,
              }}
            ></div>
            <div className="bar-label">{item.state}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentChart;
