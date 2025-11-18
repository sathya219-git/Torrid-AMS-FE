import { Accordion, Text } from "@mantine/core";
import "./P3-Moderate.css";
import IncidentTable from "../IncidentTable/IncidentTable";

export default function P3Moderate() {
  return (
      <Accordion.Item value={"3 - Moderate"}>
        <Accordion.Control className="Accordion-title">
          <Text fw={700}> P3 - Moderate </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="p3-search">
          </div>
          <IncidentTable priority="3 - Moderate" />
        </Accordion.Panel>
      </Accordion.Item>
  );
}
