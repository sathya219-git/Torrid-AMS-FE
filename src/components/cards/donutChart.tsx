import { DonutChart, PieChartProps } from "@mantine/charts";
import { Group, Text, Box, Stack, Paper } from "@mantine/core";
import "./PieChartWithExplosion.css";
// NOTE: We no longer need to import TooltipProps from 'recharts' after the fix
import { Incident, incidentsData } from "../data/incidents";

// --- 1. Define the specific type for the PieChart data array ---
type MantinePieChartData = PieChartProps["data"];

// --- 2. Define State Colors for the chart segments ---
const STATE_COLORS: Record<string, string> = {
  Open: "#FC7E80",
  "In progress": "#ECCF5C",
  "On-Hold": "#A291FD",
  Closed: "#4FDBF5",
  Resolved: "#53D7B6",
  Reopen: "#FC88F0",
};

// --- 3. Data Transformation Function (Unchanged) ---
function getPieChartData(
  incidents: Incident[],
  targetPriority: string
): MantinePieChartData {
  const filteredIncidents = incidents.filter(
    (incident) => incident.priority === targetPriority
  );

  const stateCounts = filteredIncidents.reduce((acc, incident) => {
    const stateKey = incident.state;
    acc[stateKey] = (acc[stateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData: MantinePieChartData = Object.entries(stateCounts).map(
    ([state, count]) => ({
      name: state,
      value: count,
      color: STATE_COLORS[state] || STATE_COLORS["default"],
    })
  );

  return pieChartData;
}

// ------------------------------------------------------------------
// --- 4. Custom Tooltip Component with Type Fix --------------------
// ------------------------------------------------------------------

// FIX: Define the required props explicitly to avoid the Recharts generic issue.
interface CustomTooltipProps {
  active?: boolean;
  // The type that Recharts passes for the data. We use a simple array type.
  payload?: Array<{
    // This is the property that holds the data object (name, value, color)
    payload: {
      name: string;
      value: number;
      color: string;
    };
    // Other Recharts internal properties can be ignored or typed as any
    [key: string]: any;
  }>;
  // Other Recharts internal properties
  label?: string | number;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  // TypeScript will now correctly identify 'payload' as an array of objects
  if (active && payload && payload.length) {
    // We only care about the first (and only) segment payload since tooltipDataSource="segment"
    const dataPoint = payload[0].payload;
    const name: string = dataPoint.name;
    const value: number = dataPoint.value;
    const color: string = dataPoint.color;

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
          {/* Colored circle */}
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
            {/* State Name */}
            <Text fw={300} fz="sm" c="#ffffff6e">
              {name}
            </Text>
            {/* Incident Count */}
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

// ------------------------------------------------------------------
// --- 5. Component Implementation (Unchanged) ---
// ------------------------------------------------------------------

export default function DonutCharts() {
  const TARGET_PRIORITY = "P4";

  const chartData = getPieChartData(incidentsData, TARGET_PRIORITY);
  const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalCount === 0) {
    return (
      <Stack gap="md" align="center" w={200} h={200}>
        {/* <Title order={4}>Incidents by State</Title>
                <Badge color="blue">Priority: {TARGET_PRIORITY}</Badge> */}
        <Text c="dimmed" ta="center">
          No incidents found for priority **{TARGET_PRIORITY}**.
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
