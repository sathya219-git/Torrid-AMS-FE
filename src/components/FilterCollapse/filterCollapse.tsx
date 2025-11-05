import "./filterCollapse.css";
import { Card, Collapse, Text } from "@mantine/core";
import Filter from "../Filters/filter";
import { filterState } from "../../store/filterStore";
import { useAtom, useAtomValue } from "jotai";
import Filtericon from "../../assets/Shape.png";

export default function FilterCollapse() {
  const [opened, setOpened] = useAtom(filterState);
  const filterOpened = useAtomValue(filterState);

  const onClick = () => {
    setOpened((prev) => !prev);
  };

  return (
    <div className={`filter-container ${filterOpened ? "visible" : "hidden"}`}>
      <Card className="filter-card open">
        <Card.Section
          withBorder
          inheritPadding
          py="xs"
          className="border"
          onClick={onClick}
        >
          <Text fw={550} size="xl" className="export-icon">
            Filters
            <img src={Filtericon} alt="Download" height="17" width="17" />
          </Text>
        </Card.Section>

        <Collapse in={opened}>
          <Filter />
        </Collapse>
      </Card>
    </div>
  );
}
