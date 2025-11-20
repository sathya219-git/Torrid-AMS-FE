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
import { useAtom, useSetAtom } from "jotai";
import {
  ActiveBreachAccordion,
  ActiveCriticalAccordion,
  ActiveIncidentTab,
} from "../../../store/filterStore";

export default function IncidentsList() {
  const [activeTab, setActiveTab] = useAtom(ActiveIncidentTab);
  const setActiveCriticalAccordion = useSetAtom(ActiveCriticalAccordion);
  const setActiveBreachAccordion = useSetAtom(ActiveBreachAccordion);

  return (
    <div>
      <div className="inc-list-header">
        <h1>Incident List</h1>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="1 - Critical">
            <Text fw={700}> P1 - Critical</Text>
          </Tabs.Tab>
          <Tabs.Tab value="2 - High">
            <Text fw={700}> P2 - High</Text>
          </Tabs.Tab>
          <Tabs.Tab value="3 - Moderate">
            <Text fw={700}> P3 - Moderate</Text>
          </Tabs.Tab>
          <Tabs.Tab value="4 - Low">
            <Text fw={700}> P4 - Low</Text>
          </Tabs.Tab>
        </Tabs.List>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Tabs.Panel value="1 - Critical" className="incident-breach-accordion-config">
            <Accordion 
              classNames={{ content: "accordion-padding" }}
              onChange={setActiveCriticalAccordion}
            >
              <P1Critical />
            </Accordion>
            <Accordion 
              classNames={{
                item: "accordion-border",
                content: "accordion-padding",
              }}
              onChange={setActiveBreachAccordion}
            >
              <P1CriticalBreach />
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="2 - High" className="incident-breach-accordion-config">
            <Accordion
              classNames={{ content: "accordion-padding" }}
              onChange={setActiveCriticalAccordion}
            >
              <P2High />
            </Accordion>
            <Accordion
              classNames={{
                item: "accordion-border",
                content: "accordion-padding",
              }}
              onChange={setActiveBreachAccordion}
            >
              <P2HighBreach />
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="3 - Moderate" className="incident-breach-accordion-config">
            <Accordion
              classNames={{ content: "accordion-padding" }}
              onChange={setActiveCriticalAccordion}
            >
              <P3Moderate />
            </Accordion>
            <Accordion
              classNames={{
                item: "accordion-border",
                content: "accordion-padding",
              }}
              onChange={setActiveBreachAccordion}
            >
              <P3ModerateBreach />
            </Accordion>
          </Tabs.Panel>

          <Tabs.Panel value="4 - Low" className="incident-breach-accordion-config">
            <Accordion
              classNames={{ content: "accordion-padding" }}
              onChange={setActiveCriticalAccordion}
            >
              <P4Low />
            </Accordion>
            <Accordion
              classNames={{
                item: "accordion-border",
                content: "accordion-padding",
              }}
              onChange={setActiveBreachAccordion}
            >
              <P4LowBreach />
            </Accordion>
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}
