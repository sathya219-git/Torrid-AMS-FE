import React, { useEffect, useState } from "react";
import { PieChart, PieChartProps } from "@mantine/charts";
import { Group, Text, Box, Stack, Paper } from "@mantine/core";
import "./PieChartWithExplosion.css";
import { useAtomValue } from "jotai";
import { appliedFilter } from "../../store/filterStore";
import { buildFilterQuery } from "../../utils/queryBuilder";

// --- 1️⃣ Type definitions for API response ---

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

// --- 2️⃣ Define the Mantine PieChart data type ---
type MantinePieChartData = PieChartProps["data"];

// --- 3️⃣ Define colors for states ---
const STATE_COLORS: Record<string, string> = {
  Open: "#FC7E80",
  "In progress": "#ECCF5C",
  "On-Hold": "#A291FD",
  Closed: "#4FDBF5",
  Resolved: "#53D7B6",
  Reopen: "#FC88F0",
};

// --- 4️⃣ Utility to transform API stats into PieChart data ---
function buildPieChartData(stats: PriorityStats): MantinePieChartData {
  const stateCounts: Record<string, number> = {
    Open: stats.open,
    "In progress": stats.inProgress,
    "On-Hold": stats.onHold,
    Closed: stats.closed,
    Resolved: stats.resolved,
    Reopen: stats.reopen,
  };

  return Object.entries(stateCounts).map(([state, count]) => ({
    name: state,
    value: count,
    color: STATE_COLORS[state] || "#ccc",
  }));
}

// --- 5️⃣ Tooltip Component ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      color: string;
    };
    [key: string]: any;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0].payload;

    return (
      <Paper
        radius="md"
        p="sm"
        withBorder
        style={{
          backgroundColor: "black",
          border: "none",
          height: "30px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: "10px",
        }}
      >
        <Group wrap="nowrap">
          <Box
            w={8}
            h={8}
            style={{
              backgroundColor: color,
              borderRadius: "50%",
            }}
          />
          <Stack
            gap={0}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fw={300} fz="sm" c="#ffffff6e">
              {name}
            </Text>
            <Text
              c="#fff"
              lh={1.2}
              style={{
                marginLeft: "15px",
                fontSize: "14px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {value}
            </Text>
          </Stack>
        </Group>
      </Paper>
    );
  }

  return null;
};

// --- 6️⃣ Main Component ---
export default function PieChartWithExplosion() {
  const appliedFilters = useAtomValue(appliedFilter);
  const [incidentPrioritySummary, setIncidentPrioritySummary] =
    useState<IncidentPrioritySummary | null>(null);

  const TARGET_PRIORITY = "2 - High";

  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        const url = query
          ? `http://localhost:5092/api/Incident/countbypriority?${query}`
          : `http://localhost:5092/api/Incident/countbypriority`;

        console.log("PIE URL", url);

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

  if (!incidentPrioritySummary)
    return <div>Loading priority summary...</div>;

  const priorityData = incidentPrioritySummary.priority[TARGET_PRIORITY]?.[0];

  if (!priorityData) {
    return (
      <Stack gap="md" align="center" w={200} h={200}>
        <Text c="dimmed" ta="center">
          No incidents found for priority <b>{TARGET_PRIORITY}</b>.
        </Text>
      </Stack>
    );
  }

  const chartData = buildPieChartData(priorityData);
  const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="piechart-root-container">
      
      <div className="second-row-container">
        
        <div className="pie-contaier">
          <Box w={300}>
            <Group gap={50} justify="center">
              <PieChart
                strokeWidth={1.8}
                startAngle={0}
                endAngle={360}
                data={chartData}
                withTooltip
                tooltipDataSource="segment"
                size={250}
                tooltipProps={{
                  content: CustomTooltip,
                  allowEscapeViewBox: { x: true, y: true },
                }}
              />
            </Group>
          </Box>
        </div>

        <div className="pie-state-container">
          {chartData.map((item) => (
            <div className="legend-item" key={item.name}>
              <span
                className="legend-color-dot"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-state-name">{item.name}</span>
              <span className="legend-count">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
