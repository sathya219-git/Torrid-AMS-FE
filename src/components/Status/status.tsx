import { Accordion, Badge, Checkbox, Text } from "@mantine/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { InitiateAPI, selectedStatus, status } from "../../store/filterStore";
import "./status.css";

export default function Status() {
  const statusList = useAtomValue(status);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedStatus);

  const initiateAPI = useSetAtom(InitiateAPI);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (statusList.length > 0) {
      return;
    }
    initiateAPI((prev) => {
      const curr = new Map(prev);
      curr.set(`${API_BASE_URL}/api/Incident/statuscountbypriority`, {
        method: "GET",
        body: null,
      });
      return curr;
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
