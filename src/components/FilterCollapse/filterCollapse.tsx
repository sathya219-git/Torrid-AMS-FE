import "./filterCollapse.css";
import { Card, Collapse, Text } from "@mantine/core";
import Filter from "../Filters/filter";
import { filterState } from "../../store/filterStore";
import { useAtom, useAtomValue } from "jotai";
import close_new from "../../assets/close_new.png";


export default function FilterCollapse() {
  const [opened, setOpened] = useAtom(filterState);
  const filterOpened = useAtomValue(filterState);

  const onClick = () => setOpened((prev) => !prev);

  return (
    <div className={`filter-slide ${filterOpened ? "show" : "hide"}`}>
      <Card className="filter-card">
        <Card.Section
          withBorder
          inheritPadding
          py="xs"
          className="border"
          onClick={onClick}
        >
          <Text fw={550} size="xl" className="export-icon">
            Filters
            <img src={close_new} alt="Download" height="20" width="20" />
          </Text>
        </Card.Section>
        <Collapse in={opened}>
          <Filter />
        </Collapse>
      </Card>
    </div>
  );
}
