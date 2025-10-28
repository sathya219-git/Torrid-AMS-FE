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
        console.log("API response:", res.data);
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
      status: prev.status.includes(value)
        ? prev.status.filter((v) => v !== value)
        : [...prev.status, value],
    }));
  };

  // const statuses = [
  //   { status: "Open", incidentCount: 370 },
  //   { status: "In progress", incidentCount: 132 },
  //   { status: "Closed", incidentCount: 180 },
  //   { status: "Reopen", incidentCount: 89 },
  //   { status: "On Hold", incidentCount: 32 },
  //   { status: "Resolved", incidentCount: 67 },
  // ];

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

  // const toggleChecked = (name: string) => {
  //   // setCheckedMap((prevMap) => ({
  //   //   ...prevMap,
  //   //   [name]: !prevMap.get(name),
  //   // }));
  //   setCheckedMap((prevMap) => {
  //     const newMap = new Map(prevMap);
  //     newMap.set(name, !prevMap.get(name));
  //     return newMap;
  //   });
  //   // setCheckedMap((prevMap) => {
  //   //   const newMap = new Map();
  //   //   Array.from(prevMap.entries()).forEach((entry) => {
  //   //     if (entry[0] === name) {
  //   //       newMap.set(name, !entry[1]);
  //   //     } else {
  //   //       newMap.set(entry[0], entry[1]);
  //   //     }
  //   //   });
  //   //   return newMap;
  //   // });
  // };

  useEffect(() => {
    console.log(checkedMap);
  }, [checkedMap]);

  return (
    <Accordion defaultValue="status" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="status" value="status">
        <Accordion.Control>
          <Text fw={500}>Status</Text>
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
                    checked={filters.status.includes(status.status)}
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
