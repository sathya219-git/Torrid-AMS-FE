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
  const assignees = [
    { name: "Arun Kumar m. s" },
    { name: "Meena John" },
    { name: "John John" },
    { name: "Priya John" },
    { name: "Manoj Kumar" },
    { name: "Kumar Kumar m. s" },
    { name: "Arun John" },
    { name: "Meena John" },
    { name: "John John" },
    { name: "Priya John" },
    { name: "Manoj Kumar" },
    { name: "Kumar John" },
  ];

  const categories = [
    { name: "All" },
    { name: "Ecom systems" },
    { name: "Operational" },
    { name: "General Questions" },
    { name: "Retail Systems" },
    { name: "Supply Chain" },
    { name: "All" },
    { name: "Ecom systems" },
    { name: "Operational" },
    { name: "General Questions" },
    { name: "Retail Systems" },
    { name: "Supply Chain" },
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
    <Accordion defaultValue="filter">
      <Accordion.Item key="filter" value="filter">
        <Accordion.Control>
          <Text fw={500}> Filter </Text>
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
              <Text fw={400}> Assigned To </Text>
              <div className="incident-scroll">
                {assignees.map((item) => (
                  <div className="incident-checkbox" key={item.name}>
                    <Checkbox label={item.name} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Text fw={400}> Category </Text>
              <div className="incident-scroll">
                {categories.map((item) => (
                  <div className="incident-checkbox" key={item.name}>
                    <Checkbox label={item.name} />
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
