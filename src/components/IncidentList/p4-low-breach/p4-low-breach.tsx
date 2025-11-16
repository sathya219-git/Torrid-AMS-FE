import { useAtom, useAtomValue } from "jotai";
import { appliedFilter, P4BreachFilters } from "../../../store/filterStore";
import { Accordion, Radio, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import {
  ActualResolvedTimeFilters,
  BreachSLAStatusFilters,
} from "../breached-list-filter.constants";
import { BreachFilters } from "../../../store/filter-store.interface";
import { useCallback } from "react";

export default function P4LowBreach() {
  const [p4BreachFilters, setP4BreachFilters] = useAtom(P4BreachFilters);
  const mainAppliedFilters = useAtomValue(appliedFilter);
  
  const setValue = useCallback((key: keyof BreachFilters, value: string) => {
    setP4BreachFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  return (
    <Accordion.Item value={"4 - Low"}>
      <Accordion.Control>
        <Text fw={700}>P4 - Low Breach List </Text>
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
              <Accordion.Control className="Accordion-title" style={{backgroundColor:"#EAECF5"}}>
                <Text fw={600}>Filter</Text>
              </Accordion.Control>

              <Accordion.Panel style={{backgroundColor:"#fff"}}>
                <div className="BL-filter-container">
                  <div>
                    <Text fw={500} mb="xs">
                      Assigned To
                    </Text>
                    <div className="incident-scroll">
                      <Radio.Group
                        name="p4AssignedTo"
                        value={p4BreachFilters.assignedTo}
                        onChange={(e) => setValue("assignedTo", e)}
                      >
                        {mainAppliedFilters.AssignedToName.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio label={item} value={item} onClick={() => {
                                // If already selected → unselect
                                if (p4BreachFilters.assignedTo === item) {
                                  setValue("assignedTo", ""); // CLEAR
                                }
                              }}/>
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
                        name="p4Category"
                        value={p4BreachFilters.categories}
                        onChange={(e) => setValue("categories", e)}
                      >
                        {mainAppliedFilters.Category.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio label={item} value={item}  onClick={() => {
                                // If already selected → unselect
                                if (p4BreachFilters.categories === item) {
                                  setValue("categories", ""); // CLEAR
                                }
                              }}/>
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
                        name="p4ActualResolvedTime"
                        value={p4BreachFilters.actualResolvedTime}
                        onChange={(e) => setValue("actualResolvedTime", e)}
                      >
                        {ActualResolvedTimeFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.time} value={item.value} onClick={() => {
                                // If the clicked option is already selected → unselect it
                                if (
                                  p4BreachFilters.actualResolvedTime ===
                                  item.value
                                ) {
                                  setValue("actualResolvedTime", ""); // clear selection
                                }
                              }}/>
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
                        name="p4BreachSLA"
                        value={p4BreachFilters.breachSLA}
                        onChange={(e) => setValue("breachSLA", e)}
                      >
                        {BreachSLAStatusFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.status} value={item.value} onClick={() => {
                                // If the clicked option is already selected → unselect it
                                if (
                                  p4BreachFilters.breachSLA ===
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
        <BreachedListTable priority="4 - Low" breachFilters={p4BreachFilters} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
