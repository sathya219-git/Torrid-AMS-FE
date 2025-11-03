import { Card } from "@mantine/core";
import "./TeamMembersPortfolio.css";
import { filterState } from "../../store/filterStore";
import { useAtomValue } from "jotai";
import IncidentsList from "../IncidentList/IncidentsList/IncidentsList";

export default function TeamMembersPortfolio() {
  const filterOpened = useAtomValue(filterState);

  return (
    <Card
      padding="lg"
      shadow="sm"
      radius="md"
      className={`team-member-card ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xl">
        <IncidentsList />
      </Card.Section>
    </Card>
  );
}
