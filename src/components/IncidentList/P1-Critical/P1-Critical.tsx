import { Accordion, Text } from "@mantine/core";
import "./P1-Critical.css";
import IncidentTable from "../IncidentTable/IncidentTable";

export default function P1Critical() {
  return (
    <Accordion.Item value={"1 - Critical"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}>P1 - Critical </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="p1-search">
        </div>
        <IncidentTable priority="1 - Critical" />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
