import { Accordion, Badge, Checkbox, Text } from "@mantine/core";
import "./status.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import axios from "axios";

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
        console.error("Error fetching category counts:", err);
        setStatuses([]);
      });
  }, []);

  const statusChanges = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      State: prev.State.includes(value)
        ? prev.State.filter((v) => v !== value)
        : [...prev.State, value],
    }));
  };

  const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (checkedMap.size) {
      return;
    }
    const newMap = new Map();
    statuses.forEach((status) => {
      newMap.set(status.status, false);
    });
    setCheckedMap(newMap);
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
              const isSelected = checkedMap.get(status.status) === true;
              return (
                <div
                  key={status.status}
                  className={`status-checkbox ${isSelected ? "selected" : ""}`}
                >
                  <Checkbox
                    label={status.status}
                    onChange={() => statusChanges(status.status)}
                    checked={filters.State.includes(status.status)}
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
