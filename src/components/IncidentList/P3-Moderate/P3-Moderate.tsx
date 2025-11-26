import { Accordion, Input, Text } from "@mantine/core";
import "./P3-Moderate.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import {
  P3IncidentSearch,
  P3IncidentsResponse,
} from "../../../store/filterStore";
import { useAtom, useAtomValue } from "jotai";

export default function P3Moderate() {
  const [p3IncidentSearch, setP1IncidentSearch] = useAtom(P3IncidentSearch);
  const p3IncidentsResponse = useAtomValue(P3IncidentsResponse);

  return (
    <Accordion.Item value={"3 - Moderate"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}> P3 - Moderate </Text>
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
          const value = ((e.target as HTMLInputElement).value || '').trim();
            if (e.key === "Enter") {
              setP1IncidentSearch(value);
            } else if (!value) {
              setP1IncidentSearch("");
            }
          }}
        />
        <IncidentTable
          priority="3 - Moderate"
          Search={p3IncidentSearch}
          incidentsResponse={p3IncidentsResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
