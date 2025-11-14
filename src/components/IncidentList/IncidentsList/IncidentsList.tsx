import { Accordion, Tabs, Text } from "@mantine/core";
import "./IncidentsList.css";
import P1Critical from "../P1-Critical/P1-Critical";
import BreachedListTable from "../BreachedListTable/BreachedListTable";
import P2High from "../P2-High/P2-High";
import P3Moderate from "../P3-Moderate/P3-Moderate";
import P4Low from "../P4-Low/P4-Low";
import BreachedListFilter from "../BreachedListFilter/breachedListFilter";

export default function IncidentsList() {
  return (
    <div>
      <div className="inc-list-header">
          <h1>Critical Incident List</h1>
      </div>

      <Tabs defaultValue={"P1-Critical"}>
        <Tabs.List>
          <Tabs.Tab value="P1-Critical">
            <Text fw={700}> P1 - Critical</Text>
          </Tabs.Tab>
          <Tabs.Tab value="P2-High">
            <Text fw={700}> P2 - High</Text>
          </Tabs.Tab>
          <Tabs.Tab value="P3-Moderate">
            <Text fw={700}> P3 - Moderate</Text>
          </Tabs.Tab>
          <Tabs.Tab value="P4-Low">
            <Text fw={700}> P4 - Low</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="P1-Critical">
          <Accordion classNames={{ content: "accordion-padding" }}>
            <P1Critical />
          </Accordion>
          <Accordion
            classNames={{
              item: "accordion-border",
              content: "accordion-padding",
            }}
          >
            <Accordion.Item value={"1 - Critical"}>
              <Accordion.Control>
                <Text fw={700}>P1 - Critical Breach List </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div>
                  <BreachedListFilter />
                </div>
                <BreachedListTable priority="1 - Critical" />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>

        <Tabs.Panel value="P2-High">
          <Accordion classNames={{ content: "accordion-padding" }}>
            <P2High />
          </Accordion>
          <Accordion
            classNames={{
              item: "accordion-border",
              content: "accordion-padding",
            }}
          >
            <Accordion.Item value={"2 - High"}>
              <Accordion.Control>
                <Text fw={700}>P2 - High Breach List </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div>
                  <BreachedListFilter />
                </div>
                <BreachedListTable priority="2 - High" />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>

        <Tabs.Panel value="P3-Moderate">
          <Accordion classNames={{ content: "accordion-padding" }}>
            <P3Moderate />
          </Accordion>
          <Accordion
            classNames={{
              item: "accordion-border",
              content: "accordion-padding",
            }}
          >
            <Accordion.Item value={"3 - Moderate"}>
              <Accordion.Control>
                <Text fw={700}>P3 - Moderate Breach List </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div>
                  <BreachedListFilter />
                </div>
                <BreachedListTable priority="3 - Moderate" />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>

        <Tabs.Panel value="P4-Low">
          <Accordion classNames={{ content: "accordion-padding" }}>
            <P4Low />
          </Accordion>
          <Accordion
            classNames={{
              item: "accordion-border",
              content: "accordion-padding",
            }}
          >
            <Accordion.Item value={"4 - Low"}>
              <Accordion.Control>
                <Text fw={700}>P4 - Low Breach List </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div>
                  <BreachedListFilter />
                </div>
                <BreachedListTable priority="4 - Low" />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
