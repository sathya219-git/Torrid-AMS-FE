import { Accordion, Input, Text } from "@mantine/core";
import "./P1-Critical.css";
import IncidentTable from "../IncidentTable/IncidentTable";
import {
  P1IncidentSearch,
  P1IncidentsResponse,
} from "../../../store/filterStore";
import { useAtom, useAtomValue } from "jotai";

export default function P1Critical() {
  const [p1IncidentSearch, setP1IncidentSearch] = useAtom(P1IncidentSearch);
  const p1IncidentsResponse = useAtomValue(P1IncidentsResponse);

  return (
    <Accordion.Item value={"1 - Critical"}>
      <Accordion.Control className="Accordion-title">
        <Text fw={700}>P1 - Critical </Text>
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
        />{" "}
        <IncidentTable
          priority="1 - Critical"
          Search={p1IncidentSearch}
          incidentsResponse={p1IncidentsResponse}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
