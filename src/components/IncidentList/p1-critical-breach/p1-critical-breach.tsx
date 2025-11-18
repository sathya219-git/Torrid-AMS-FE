import { Accordion, Radio, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import { useAtom, useAtomValue } from "jotai";
import { appliedFilter, P1BreachFilters } from "../../../store/filterStore";
import { BreachFilters } from "../../../store/filter-store.interface";
import {
  ActualResolvedTimeFilters,
  BreachSLAStatusFilters,
} from "../breached-list-filter.constants";
import { useCallback } from "react";

export default function P1CriticalBreach() {
  const mainAppliedFilters = useAtomValue(appliedFilter);

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
              <Accordion.Control
                className="Accordion-title"
                style={{ backgroundColor: "#EAECF5" }}
              >
                <Text fw={600}>Filter</Text>
              </Accordion.Control>

              <Accordion.Panel style={{ backgroundColor: "#fff" }}>
                <div className="BL-filter-container">
                  <div>
                    <Text fw={500} mb="xs">
                      Assigned To
                    </Text>
                    <div className="incident-scroll">
                      <Radio.Group
                        name="p1AssignedTo"
                        value={p1BreachFilters.assignedTo}
                        onChange={(e) => setValue("assignedTo", e)}
                      >
                        {mainAppliedFilters.AssignedToName.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio
                              label={item}
                              value={item}
                              onClick={() => {
                                // If already selected → unselect
                                if (p1BreachFilters.assignedTo === item) {
                                  setValue("assignedTo", ""); // CLEAR
                                }
                              }}
                            />
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
                  <div>
                    <Text fw={500} mb="xs">
                      Category
                    </Text>
                    <div className="incident-scroll">
                      <Radio.Group
                        name="p1Category"
                        value={p1BreachFilters.categories}
                        onChange={(e) => setValue("categories", e)}
                      >
                        {mainAppliedFilters.Category.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio
                              label={item}
                              value={item}
                              onClick={() => {
                                // If already selected → unselect
                                if (p1BreachFilters.categories === item) {
                                  setValue("categories", ""); // CLEAR
                                }
                              }}
                            />
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
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
                            <Radio
                              label={item.time}
                              value={item.value}
                              onClick={() => {
                                // If the clicked option is already selected → unselect it
                                if (
                                  p1BreachFilters.actualResolvedTime ===
                                  item.value
                                ) {
                                  setValue("actualResolvedTime", ""); // clear selection
                                }
                              }}
                            />
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
                            <Radio label={item.status} value={item.value} onClick={() => {
                                // If the clicked option is already selected → unselect it
                                if (
                                  p1BreachFilters.breachSLA ===
                                  item.value
                                ) {
                                  setValue("breachSLA", ""); // clear selection
                                }
                              }}/>
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
