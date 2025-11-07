import { Accordion, Input, Text } from "@mantine/core";
import "./P1-Critical.css";
import { useState } from "react";
import IncidentTable from "../IncidentTable/IncidentTable";

export default function P1Critical() {
  const [search, setSearch] = useState("");
  return (
    <Accordion.Item value={"1 - Critical"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}>P1 - Critical </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="p1-search">
          <Input
            className=""
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <IncidentTable priority="1 - Critical" search={search} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
