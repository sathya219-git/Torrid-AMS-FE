import { Checkbox, Text } from "@mantine/core";
import "./priority.css";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Priority() {
  type Priority = {
    priority: string;
    totalCount: number;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/countbypriority")
      .then((res) => {
        console.log("API response:", res.data);
        
        const priorityData = res.data.priority || {};
        const parsedData: Priority[] = Object.entries(priorityData).map(
          ([priorityName, details]) => {
            const totalCount =
              Array.isArray(details) && details.length > 0
                ? details[0].totalCount
                : 0;
            return {
              priority: priorityName,
              totalCount,
            };
          }
        );

        setPriorities(parsedData);
      })
      .catch((err) => {
        console.error("Error fetching priority data:", err);
        setPriorities([]);
      });
  }, []);

  const PriorityChanges = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      incidentPriority: prev.incidentPriority.includes(value)
        ? prev.incidentPriority.filter((v) => v !== value)
        : [...prev.incidentPriority, value],
    }));
  };

  // const priorities = [
  //   { priority: "P1 - Critical", totalCount: 10 },
  //   { priority: "P2 - High", totalCount: 15 },
  //   { priority: "P3 - Moderate", totalCount: 25 },
  //   { priority: "P4 - Low", totalCount: 75 },
  // ];
  return (
    <div className="priority-container">
      <Text fw={500}>Incident Priority</Text>
      <div className="priority-content">
        {priorities.map((incidentPriority) => (
          <div className="priority-checkbox" key={incidentPriority.priority}>
            <Checkbox
              label={incidentPriority.priority}
              onChange={() => PriorityChanges(incidentPriority.priority)}
              checked={filters.incidentPriority.includes(
                incidentPriority.priority
              )}
            />
            <Text c="dimmed">{incidentPriority.totalCount}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
