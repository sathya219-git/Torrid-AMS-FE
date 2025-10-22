import { Card, Text } from "@mantine/core";
import "./filteredResults.css";

export default function FilteredResult() {
  return (
    <Card padding="lg" radius="md" className="filter-result-card" withBorder>
      <Card.Section withBorder inheritPadding py="xl">
        <div className="selected-filter">
          <Text fw={500} size="xl">
            Filtered Results
          </Text>
        </div>
      </Card.Section>
    </Card>
  );
}
