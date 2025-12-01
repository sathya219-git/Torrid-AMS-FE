import { Card } from "@mantine/core";
import "./filteredResults.css";
import Cards from "../cards/cards";
import { useAtomValue } from "jotai";
import { filterState } from "../../store/filterStore";

export default function FilteredResult() {
  const filterOpened = useAtomValue(filterState);

  return (
    <Card
      padding="lg"
      shadow="sm"
      radius="md"
      className={`filtered-result ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xl">
        <div className="selected-filter">
          <Cards />
        </div>
      </Card.Section>

      
    </Card>
  );
}
