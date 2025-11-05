import { Accordion, Input, Text } from "@mantine/core";
import "./P3-Moderate.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import { useState } from "react";

export default function P3Moderate() {
  const [search, setSearch] = useState("");
  return (
    <div className="p3-container">
      <Accordion.Item value={"3 - Moderate"}>
        <Accordion.Control>
          <Text fw={700}> P3 - Moderate </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="p3-search">
            <Input
              className=""
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <IncidentTable priority="3 - Moderate" search={search} />
        </Accordion.Panel>
      </Accordion.Item>
    </div>
  );
}
