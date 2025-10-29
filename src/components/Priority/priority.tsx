import { Checkbox, Text } from "@mantine/core";
import "./priority.css";
import { useAtom } from "jotai";
import { incidentAPIRequests, selectedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Priority() {
  type Priority = {
    priority: string;
    totalCount: number;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [incidentAPIReqs, setIncidentAPIRequests] =
    useAtom(incidentAPIRequests);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/countbypriority")
      .then((res) => {
        const priorityData = res.data.priority || {};
        const updatedIncidentAPIReqs = { ...incidentAPIReqs };
        const parsedData: Priority[] = Object.entries(priorityData).map(
          ([priorityName, details]) => {
            const totalCount =
              Array.isArray(details) && details.length > 0
                ? details[0].totalCount
                : 0;
            updatedIncidentAPIReqs[priorityName] = {
              PageNumber: 1,
              PageSize: 4,
              SortOrder: "",
              SortBy: "",
              Search: "",
            };
            return {
              priority: priorityName,
              totalCount,
            };
          }
        );

        setIncidentAPIRequests(updatedIncidentAPIReqs);
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
      Priority: prev.Priority.includes(value)
        ? prev.Priority.filter((v) => v !== value)
        : [...prev.Priority, value],
    }));
  };

  return (
    <div className="priority-container">
      <Text fw={500}>Incident Priority</Text>
      <div className="priority-content">
        {priorities.map((incidentPriority) => (
          <div className="priority-checkbox" key={incidentPriority.priority}>
            <Checkbox
              label={incidentPriority.priority}
              onChange={() => PriorityChanges(incidentPriority.priority)}
              checked={filters.Priority.includes(incidentPriority.priority)}
            />
            <Text c="dimmed">{incidentPriority.totalCount}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
