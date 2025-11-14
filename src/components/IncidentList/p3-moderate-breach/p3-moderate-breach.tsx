import { useAtom } from "jotai";
import { P3BreachFilters } from "../../../store/filterStore";
import { Accordion, Radio, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import {
  ActualResolvedTimeFilters,
  BreachSLAStatusFilters,
} from "../breached-list-filter.constants";
import { BreachFilters } from "../../../store/filter-store.interface";
import { useCallback } from "react";

export default function P3ModerateBreach() {
  const [p3BreachFilters, setP3BreachFilters] = useAtom(P3BreachFilters);

  const setValue = useCallback((key: keyof BreachFilters, value: string) => {
    setP3BreachFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  return (
    <Accordion.Item value={"3 - Moderate"}>
      <Accordion.Control>
        <Text fw={700}>P3 - Moderate Breach List </Text>
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
                        name="p3ActualResolvedTime"
                        value={p3BreachFilters.actualResolvedTime}
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
                        name="p3BreachSLA"
                        value={p3BreachFilters.breachSLA}
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
          priority="3 - Moderate"
          breachFilters={p3BreachFilters}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
