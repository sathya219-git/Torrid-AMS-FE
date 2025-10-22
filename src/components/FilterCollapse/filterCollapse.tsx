import "./filterCollapse.css";
import { Card, Collapse, Text } from "@mantine/core";
import Filter from "../Filters/filter";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { filterState } from "../../store/filterStore";
import { useAtom } from "jotai";

export default function FilterCollapse() {
  const [opened, setOpened] = useAtom(filterState);

  const onClick = () => {
    setOpened((prev) => !prev);
  };

  return (
    <Card
      onClick={() => onClick()}
      className={'filter-card ${opened ? "filter-opened" :""}'}
    >
      <Card.Section withBorder inheritPadding py="xs" className="border">
        <Text fw={400} size="xl" className="export-icon">
          Filters
          <ImportExportIcon fontSize="medium" />
        </Text>
      </Card.Section>
      <Collapse in={opened}>
        <Filter />
      </Collapse>
    </Card>
  );
}
