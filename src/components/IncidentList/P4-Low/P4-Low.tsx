import { Accordion, Input, Text } from "@mantine/core";
import "./P4-Low.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import {
  P4IncidentSearch,
  P4IncidentsResponse,
} from "../../../store/filterStore";
import { useAtom, useAtomValue } from "jotai";

export default function P4Low() {
  const [p4IncidentSearch, setP4IncidentSearch] = useAtom(P4IncidentSearch);
  const p4IncidentsResponse = useAtomValue(P4IncidentsResponse);

  return (
    <Accordion.Item value={"4 - Low"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}> P4 - Low </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Input
          radius="md"
          styles={{
            input: {
              border: "1px solid #2c2c2c31",
              borderRadius: "8px",
              padding: "22px",
              outline: "none",
              boxShadow: "none",

              "&:focus": {
                outline: "none",
                boxShadow: "none",
                // borderColor: "inherit", // optional subtle border
              },
            },
          }}
          placeholder="Search here..."
          onKeyUp={(e) => {
            const value = (e.target as HTMLInputElement).value;
            if (e.key === "Enter") {
              setP4IncidentSearch(value);
            } else if (!value) {
              setP4IncidentSearch("");
            }
          }}
        />
        <IncidentTable
          priority="4 - Low"
          Search={p4IncidentSearch}
          incidentsResponse={p4IncidentsResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
