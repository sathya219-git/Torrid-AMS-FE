import { useAtom, useAtomValue } from "jotai";
import {
  P4BreachedResponse,
  P4BreachFilters,
} from "../../../store/filterStore";
import { Accordion, Input, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import { BreachFilters } from "../../../store/filter-store.interface";
import { useCallback } from "react";

export default function P4LowBreach() {
  const [p4BreachFilters, setP4BreachFilters] = useAtom(P4BreachFilters);
  const p4BreachedResponse = useAtomValue(P4BreachedResponse);

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
        <Input
          radius="md"
          styles={{
            input: {
              border: "1px solid #2c2c2c31",
              borderRadius: "8px",
              padding: "22px",
              outline: "none",
              boxShadow: "none",

              "&:focus": {
                outline: "none",
                boxShadow: "none",
                // borderColor: "inherit", // optional subtle border
              },
            },
          }}
          placeholder="Search here..."
          onKeyUp={(e) => {
          const value = ((e.target as HTMLInputElement).value || '').trim();
            if (e.key === "Enter") {
              setValue("Search", value);
            } else if (!value) {
              setValue("Search", "");
            }
          }}
        />
        {/* <div>
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
                               
                                if (p4BreachFilters.assignedTo === item) {
                                  setValue("assignedTo", "");
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
                                
                                if (p4BreachFilters.categories === item) {
                                  setValue("categories", "");
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
                               
                                if (
                                  p4BreachFilters.actualResolvedTime ===
                                  item.value
                                ) {
                                  setValue("actualResolvedTime", ""); 
                                }
                              }}/>
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>

                  
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
                               
                                if (
                                  p4BreachFilters.breachSLA ===
                                  item.value
                                ) {
                                  setValue("breachSLA", ""); 
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
        </div> */}
        <BreachedListTable
          priority="4 - Low"
          breachFilters={p4BreachFilters}
          breachedResponse={p4BreachedResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
