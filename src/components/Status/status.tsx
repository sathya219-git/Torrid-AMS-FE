import { Accordion, Badge, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { selectedStatus } from "../../store/filterStore";
import "./status.css";
import { StatusItem } from "./status.interface";

export default function Status() {
  const [selectedFilters, setSelectedFilters] = useAtom(selectedStatus);
  const [statusList, setStatusList] = useState<StatusItem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/statuscountbypriority")
      .then((res) => {
        const data: StatusItem[] = Array.isArray(res.data) ? res.data : [];
        setStatusList(data);
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
        setStatusList([]);
      });
  }, []);

  const statusChanges = useCallback((value: string) => {
    setSelectedFilters((prev) => {
      return prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
    });
  }, []);

  return (
    <Accordion defaultValue="status" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="status" value="status">
        <Accordion.Control>
          <Text fw={700}>Status</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="status-content">
            {statusList.map((status) => {
              const isSelected = selectedFilters.includes(status.status);
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
