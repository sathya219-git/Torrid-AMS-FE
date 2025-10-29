import { DonutChart, PieChartProps } from "@mantine/charts";
import { Group, Text, Box, Stack, Paper } from "@mantine/core";
import "./PieChartWithExplosion.css";
import { useAtomValue } from "jotai";
import { appliedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import { buildFilterQuery } from "../../utils/queryBuilder";

// --- Define chart data type ---
type MantinePieChartData = PieChartProps["data"];

// --- Define color mapping ---
const STATE_COLORS: Record<string, string> = {
  Open: "#FC7E80",
  "In progress": "#ECCF5C",
  "On-Hold": "#A291FD",
  Closed: "#4FDBF5",
  Resolved: "#53D7B6",
  Reopen: "#FC88F0",
};

// --- Tooltip ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      color: string;
    };
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
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text fw={300} fz="sm" c="#ffffff6e">
              {name}
            </Text>
            <Text
              c="#fff"
              style={{
                marginLeft: "15px",
                fontSize: "14px",
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

// --- API Response Types ---
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
  priority: Record<string, PriorityStats[]>; // ✅ FIXED: Array
  totalAverageResolvedTime: string;
}

export default function DonutCharts() {
  const appliedFilters = useAtomValue(appliedFilter);
  const [chartData, setChartData] = useState<MantinePieChartData>([]);

  useEffect(() => {
    const fetchIncidentSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        const url = query
          ? `http://localhost:5092/api/Incident/countbypriority?${query}`
          : `http://localhost:5092/api/Incident/countbypriority`;

        console.log("Donut URL:", url);

        const response = await fetch(url);
        const data: IncidentPrioritySummary = await response.json();
        console.log("API Response:", data);

        // --- Extract & Transform Data ---
        const targetPriority = "4 - Low"; // You can make this prop-based
        const priorityList = data.priority[targetPriority];

        if (!priorityList || priorityList.length === 0) {
          setChartData([]);
          return;
        }

        const priorityData = priorityList[0]; // ✅ Take first object

        const transformed: MantinePieChartData = [
          {
            name: "Open",
            value: priorityData.open,
            color:
              priorityData.open === 0 ? "#E0E0E0" : STATE_COLORS["Open"],
          },
          {
            name: "In progress",
            value: priorityData.inProgress,
            color:
              priorityData.inProgress === 0
                ? "#E0E0E0"
                : STATE_COLORS["In progress"],
          },
          {
            name: "On-Hold",
            value: priorityData.onHold,
            color:
              priorityData.onHold === 0 ? "#E0E0E0" : STATE_COLORS["On-Hold"],
          },
          {
            name: "Closed",
            value: priorityData.closed,
            color:
              priorityData.closed === 0 ? "#E0E0E0" : STATE_COLORS["Closed"],
          },
          {
            name: "Resolved",
            value: priorityData.resolved,
            color:
              priorityData.resolved === 0
                ? "#E0E0E0"
                : STATE_COLORS["Resolved"],
          },
          {
            name: "Reopen",
            value: priorityData.reopen,
            color:
              priorityData.reopen === 0 ? "#E0E0E0" : STATE_COLORS["Reopen"],
          },
        ];

        setChartData(transformed);
      } catch (error) {
        console.error("Error fetching incident summary:", error);
        setChartData([]);
      }
    };

    fetchIncidentSummary();
  }, [appliedFilters]);

  if (chartData.length === 0) {
    return (
      <Stack gap="md" align="center" w={200} h={200}>
        <Text c="dimmed" ta="center">
          No incidents found for the selected priority.
        </Text>
      </Stack>
    );
  }

  return (
    <div className="piechart-root-container">
      <div className="second-row-container">
        <div className="pie-contaier">
          <Box w={300}>
            <Group gap={50} justify="center">
              <DonutChart
                data={chartData}
                thickness={80}
                withTooltip
                size={250}
                tooltipDataSource="segment"
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
