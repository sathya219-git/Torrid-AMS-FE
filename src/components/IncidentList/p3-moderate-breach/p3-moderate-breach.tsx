import { useAtom, useAtomValue } from "jotai";
import {
  P3BreachedResponse,
  P3BreachFilters,
} from "../../../store/filterStore";
import { Accordion, Input, Text } from "@mantine/core";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import { BreachFilters } from "../../../store/filter-store.interface";
import { useCallback } from "react";

export default function P3ModerateBreach() {
  const [p3BreachFilters, setP3BreachFilters] = useAtom(P3BreachFilters);
  const p3BreachedResponse = useAtomValue(P3BreachedResponse);

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
                        name="p3AssignedTo"
                        value={p3BreachFilters.assignedTo}
                        onChange={(e) => setValue("assignedTo", e)}
                      >
                        {mainAppliedFilters.AssignedToName.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio label={item} value={item} onClick={() => {
                                if (p3BreachFilters.assignedTo === item) {
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
                        name="p3Category"
                        value={p3BreachFilters.categories}
                        onChange={(e) => setValue("categories", e)}
                      >
                        {mainAppliedFilters.Category.map((item) => (
                          <div className="incident-checkbox" key={item}>
                            <Radio label={item} value={item}  onClick={() => {
                                
                                if (p3BreachFilters.categories === item) {
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
                        name="p3ActualResolvedTime"
                        value={p3BreachFilters.actualResolvedTime}
                        onChange={(e) => setValue("actualResolvedTime", e)}
                      >
                        {ActualResolvedTimeFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.time} value={item.value} onClick={() => {
                                
                                if (
                                  p3BreachFilters.actualResolvedTime ===
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
                        name="p3BreachSLA"
                        value={p3BreachFilters.breachSLA}
                        onChange={(e) => setValue("breachSLA", e)}
                      >
                        {BreachSLAStatusFilters.map((item) => (
                          <div className="incident-checkbox" key={item.value}>
                            <Radio label={item.status} value={item.value} onClick={() => {
                             
                                if (
                                  p3BreachFilters.breachSLA ===
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
          priority="3 - Moderate"
          breachFilters={p3BreachFilters}
          breachedResponse={p3BreachedResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
