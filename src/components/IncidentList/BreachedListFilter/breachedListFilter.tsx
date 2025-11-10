import "./breachedListFilter.css";
import { Accordion, Checkbox, Text } from "@mantine/core";

export default function BreachedListFilter() {
  const incidentIds = [
    { id: "INC0019008" },
    { id: "INC0027899" },
    { id: "INC0030753" },
    { id: "INC0046452" },
    { id: "INC0056737" },
    { id: "INC0063124" },
    { id: "INC0076835" },
    { id: "INC0088732" },
    { id: "INC0094692" },
    { id: "INC0101235" },
  ];

  const actualResolvedTimes = [
    { time: ">=12hrs" },
    { time: "12<=23hrs" },
    { time: "More than 24hrs" },
  ];

  const breachSLAStatus = [
    { status: "More than 12hrs" },
    { status: "More than 30hrs" },
    { status: "More than 1day" },
  ];
  return (
    <Accordion
      defaultValue="filter"
      classNames={{ item: "accordion-border", content: "accordion-padding" }}
    >
      <Accordion.Item key="filter" value="filter">
        <Accordion.Control className="Accordion-title">
          <Text fw={600}> Filter </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="BL-filter-container">
            <div>
              <Text fw={400}> Incident Id </Text>
              <div className="incident-scroll">
                {incidentIds.map((item) => (
                  <div className="incident-checkbox" key={item.id}>
                    <Checkbox label={`${item.id}`} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Text fw={400}>Actual Resolved Time</Text>
              <div className="incident-scroll">
                {actualResolvedTimes.map((item) => (
                  <div className="incident-checkbox" key={item.time}>
                    <Checkbox label={item.time} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Text fw={400}> Breach SLA </Text>
              <div className="incident-scroll">
                {breachSLAStatus.map((item) => (
                  <div className="incident-checkbox" key={item.status}>
                    <Checkbox label={item.status} />
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
