import { Accordion, Input, Text } from "@mantine/core";
import "./P2-High.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import { useState } from "react";

export default function P2High() {
  const [search, setSearch] = useState("");
  return (
    <div className="p2-container">
      <Accordion.Item value={"2 - High"}>
        <Accordion.Control>
          <Text fw={700}>P2 - High (9)</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="p2-search">
            <Input
              className=""
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <IncidentTable priority="2 - High" search={search} />
        </Accordion.Panel>
      </Accordion.Item>
    </div>
  );
}
