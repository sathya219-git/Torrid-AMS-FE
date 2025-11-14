import { Accordion, Checkbox, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { breachFiltersAtom } from "../../../store/filterStore";
import "./breachedListFilter.css";
import { BreachFilters } from "../../../store/filter-store.interface";

export default function BreachedListFilter() {
  const [breachFilters, setBreachFilters] = useAtom(breachFiltersAtom);
  const [incidentIds, setIncidentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const actualResolvedTimes = [
    { time: ">= 12 hrs", value: ">=12h" },
    { time: ">= 24 hrs", value: ">=24h" },
    { time: ">= 36 hrs", value: ">=36h" },
  ];
 
  const breachSLAStatus = [
    { status: ">= 12 hrs", value: ">=12h" },
    { status: ">= 30 hrs", value: ">=30h" },
    { status: ">= 1 day", value: ">=1d" },
  ];

  const toggleValue = (key: keyof BreachFilters, value: string) => {
    setBreachFilters((prev) => {
      const exists = prev[key].includes(value);
      const updated = {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value) // remove if exists
          : [...prev[key], value], // add if not
      };

      return updated;
    });
  };
  // Fetch incident IDs from backend
  useEffect(() => {
    const fetchIncidentIds = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:5092/api/Incident/breachlistbypriority?PageNumber=1&PageSize=1000`;
        const res = await axios.get(url);
        const ids = res.data.items?.map((x: any) => x.incidentNumber) ?? [];
        setIncidentIds(ids);
      } catch (err) {
        console.error("Error fetching incident IDs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidentIds();
  }, []);
  return (
    <Accordion
      defaultValue="filter"
      classNames={{ item: "accordion-border", content: "accordion-padding" }}
    >
      <Accordion.Item value="filter">
        <Accordion.Control className="Accordion-title">
          <Text fw={600}>Filter</Text>
        </Accordion.Control>

        <Accordion.Panel>
          <div className="BL-filter-container">
            {/* ✅ Incident IDs */}
            <div>
              <Text fw={500} mb="xs">
                Incident ID
              </Text>

              <div className="incident-scroll">
                {loading ? (
                  <Text size="sm" c="dimmed">
                    Loading incidents...
                  </Text>
                ) : (
                  incidentIds.map((id) => (
                    <div className="incident-checkbox" key={id}>
                      <Checkbox
                        label={id}
                        checked={breachFilters.incidentId.includes(id)}
                        onChange={() => toggleValue("incidentId", id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <Text fw={500} mb="xs">
                Actual Resolved Time
              </Text>
              <div className="incident-scroll">
                {actualResolvedTimes.map((item) => (
                  <div className="incident-checkbox" key={item.value}>
                    <Checkbox
                      label={item.time}
                      checked={breachFilters.actualResolvedTime.includes(
                        item.value
                      )}
                      onChange={() =>
                        toggleValue("actualResolvedTime", item.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Breach SLA */}
            <div>
              <Text fw={500} mb="xs">
                Breach SLA
              </Text>
              <div className="incident-scroll">
                {breachSLAStatus.map((item) => (
                  <div className="incident-checkbox" key={item.value}>
                    <Checkbox
                      label={item.status}
                      checked={breachFilters.breachSLA.includes(item.value)}
                      onChange={() => toggleValue("breachSLA", item.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
