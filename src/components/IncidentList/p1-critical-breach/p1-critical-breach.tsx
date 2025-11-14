import { Accordion, Radio, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import { useAtom } from "jotai";
import { P1BreachFilters } from "../../../store/filterStore";
import { BreachFilters } from "../../../store/filter-store.interface";
import {
  ActualResolvedTimeFilters,
  BreachSLAStatusFilters,
} from "../breached-list-filter.constants";
import { useCallback } from "react";

export default function P1CriticalBreach() {
  const [p1BreachFilters, setP1BreachFilters] = useAtom(P1BreachFilters);

  const setValue = useCallback((key: keyof BreachFilters, value: string) => {
    setP1BreachFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  return (
    <Accordion.Item value={"1 - Critical"}>
      <Accordion.Control>
        <Text fw={700}>P1 - Critical Breach List </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div>
          <Accordion
            defaultValue="filter"
            classNames={{
              item: "accordion-border",
              content: "accordion-padding",
            }}
          >
            <Accordion.Item value="filter">
              <Accordion.Control className="Accordion-title">
                <Text fw={600}>Filter</Text>
              </Accordion.Control>

              <Accordion.Panel>
                <div className="BL-filter-container">
                  <div>
                    <Text fw={500} mb="xs">
                      Actual Resolved Time
                    </Text>
                    <div className="incident-scroll">
                      <Radio.Group
                        name="p1ActualResolvedTime"
                        value={p1BreachFilters.actualResolvedTime}
                        onChange={(e) => setValue("actualResolvedTime", e)}
                      >
                        {ActualResolvedTimeFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.time} value={item.value} />
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>

                  {/* ✅ Breach SLA */}
                  <div>
                    <Text fw={500} mb="xs">
                      Breach SLA
                    </Text>
                    <div className="incident-scroll">
                      <Radio.Group
                        name="p1BreachSLA"
                        value={p1BreachFilters.breachSLA}
                        onChange={(e) => setValue("breachSLA", e)}
                      >
                        {BreachSLAStatusFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.status} value={item.value} />
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
        <BreachedListTable
          priority="1 - Critical"
          breachFilters={p1BreachFilters}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
