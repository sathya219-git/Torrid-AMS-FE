import { Accordion, Text } from "@mantine/core";
import "./P4-Low.css";
import IncidentTable from "../IncidentTable/IncidentTable";

export default function P4Low() {
  return (
    <Accordion.Item value={"4 - Low"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}> P4 - Low </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="p4-search">
        </div>
        <IncidentTable priority="4 - Low" />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
