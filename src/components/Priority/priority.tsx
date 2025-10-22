import { Checkbox, Text } from "@mantine/core";
import "./priority.css";

export default function Priority() {
  const priorities = [
    { name: "P1 - Critical", count: 10 },
    { name: "P2 - High", count: 15 },
    { name: "P3 - Moderate", count: 25 },
    { name: "P4 - Low", count: 75 },
  ];
  return (
    <div className="priority-container">
      <Text fw={500}>Incident Priority</Text>
      <div className="priority-content">
        {priorities.map((priority) => (
          <div className="priority-checkbox" key={priority.name}>
            <Checkbox label={priority.name} />
            <Text c="dimmed">{priority.count}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
