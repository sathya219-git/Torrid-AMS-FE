import { Accordion, Badge, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { selectedFilter } from "../../store/filterStore";
import "./status.css";

export default function Status() {
  type Status = {
    status: string;
    incidentCount: number;
  };
  const [filters, setFilters] = useAtom(selectedFilter);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/statuscountbypriority")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStatuses(data);
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
        setStatuses([]);
      });
  }, []);

  const statusChanges = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      State: prev.State.includes(value)
        ? prev.State.filter((v) => v !== value)
        : [...prev.State, value],
    }));
  }, []);

  return (
    <Accordion defaultValue="status" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="status" value="status">
        <Accordion.Control>
          <Text fw={700}>Status</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="status-content">
            {statuses.map((status) => {
              const isSelected = filters.State.includes(status.status);
              return (
                <div
                  key={status.status}
                  className={`status-checkbox ${isSelected ? "selected" : ""}`}
                >
                  <Checkbox
                    label={status.status}
                    onChange={() => statusChanges(status.status)}
                    checked={isSelected}
                  />
                  <Badge
                    size="lg"
                    classNames={{
                      root: `badge-padding ${isSelected ? "selected" : ""}`,
                    }}
                    variant="filled"
                  >
                    {status.incidentCount}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
