import { Accordion, Input, Text } from "@mantine/core";
import "./P2-High.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import { useAtom, useAtomValue } from "jotai";
import {
  P2IncidentSearch,
  P2IncidentsResponse,
} from "../../../store/filterStore";

export default function P2High() {
  const [p2IncidentSearch, setP1IncidentSearch] = useAtom(P2IncidentSearch);
  const p2IncidentsResponse = useAtomValue(P2IncidentsResponse);

  return (
    <Accordion.Item value={"2 - High"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}>P2 - High </Text>
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
              setP1IncidentSearch(value);
            } else if (!value) {
              setP1IncidentSearch("");
            }
          }}
        />
        <IncidentTable
          priority="2 - High"
          Search={p2IncidentSearch}
          incidentsResponse={p2IncidentsResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
