import { Card, Text } from "@mantine/core";
import "./TeamMembersPortfolio.css";
import { filterState } from "../../store/filterStore";
import { useAtomValue } from "jotai";

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
          Team Members Portfolio
        </Text>
      </Card.Section>
    </Card>
  );
}
