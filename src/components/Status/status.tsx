import { Accordion, Badge, Checkbox, Text } from "@mantine/core";
import "./status.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";

export default function Status() {
  const [filters, setFilters] = useAtom(selectedFilter);

  const statusChanges = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((v) => v !== value)
        : [...prev.status, value],
    }));
  };

  const statuses = [
    { name: "Open", count: 370 },
    { name: "In progress", count: 132 },
    { name: "Closed", count: 180 },
    { name: "Reopen", count: 89 },
    { name: "On Hold", count: 32 },
    { name: "Resolved", count: 67 },
  ];

  const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (checkedMap.size) {
      return;
    }
    const newMap = new Map();
    statuses.forEach((status) => {
      newMap.set(status.name, false);
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
              const isSelected = checkedMap.get(status.name) === true;
              return (
                <div
                  key={status.name}
                  className={`status-checkbox ${isSelected ? "selected" : ""}`}
                >
                  <Checkbox
                    label={status.name}
                    // checked={checkedMap.get(status.name) === true}
                    // onChange={() => toggleChecked(status.name)}
                    onClick={() => statusChanges(status.name)}
                    checked={filters.status.includes(status.name)}
                  />
                  <Badge
                    size="lg"
                    classNames={{
                      root: `badge-padding ${isSelected ? "selected" : ""}`,
                    }}
                    variant="filled"
                  >
                    {status.count}
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
