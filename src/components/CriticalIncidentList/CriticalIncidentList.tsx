import { Card, Text } from "@mantine/core";
import "./CriticalIncidentList.css";
import { useAtomValue } from "jotai";
import { filterState } from "../../store/filterStore";

export default function CriticalIncidentList() {
  const filterOpened = useAtomValue(filterState);
  return (
    <Card
      padding="lg"
      shadow="sm"
      radius="md"
      className={`critical-card ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xl">
        <Text fw={500} size="xl">
          Critical Incident List
        </Text>
      </Card.Section>
    </Card>
  );
}
