import { Accordion, Tabs, Text } from "@mantine/core";
import "./IncidentsList.css";
import P1Critical from "../P1-Critical/P1-Critical";
import P2High from "../P2-High/P2-High";
import P3Moderate from "../P3-Moderate/P3-Moderate";
import P4Low from "../P4-Low/P4-Low";
import P1CriticalBreach from "../p1-critical-breach/p1-critical-breach";
import P2HighBreach from "../p2-high-breach/p2-high-breach";
import P3ModerateBreach from "../p3-moderate-breach/p3-moderate-breach";
import P4LowBreach from "../p4-low-breach/p4-low-breach";

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
            <P1CriticalBreach />
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
            <P2HighBreach />
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
            <P3ModerateBreach />
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
            <P4LowBreach />
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
