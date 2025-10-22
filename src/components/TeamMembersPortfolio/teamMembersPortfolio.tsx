import { Card, Text } from "@mantine/core";
import "./TeamMembersPortfolio.css";
import { filterState } from "../../store/filterStore";
import { useAtomValue } from "jotai";
import CriticalIncidentsList from "../criticalincidentlist/CriticalIncidentsList ";

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
        <Text fw={500} size="xl">
        <CriticalIncidentsList/>
        </Text>
      </Card.Section>
    </Card>
  );
}
