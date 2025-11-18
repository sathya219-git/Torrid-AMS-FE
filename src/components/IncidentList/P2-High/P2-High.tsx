import { Accordion, Text } from "@mantine/core";
import "./P2-High.css";
import IncidentTable from "../IncidentTable/IncidentTable";

export default function P2High() {
  return (
    <Accordion.Item value={"2 - High"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}>P2 - High </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="p2-search">
        </div>
        <IncidentTable priority="2 - High" />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
