import { Accordion, Input, Text } from "@mantine/core";
import "./P4-Low.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import { useState } from "react";

export default function P4Low() {
  const [search, setSearch] = useState("");
  return (
    <Accordion.Item value={"4 - Low"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}> P4 - Low </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="p4-search">
          <Input
            className=""
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <IncidentTable priority="4 - Low" search={search} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
