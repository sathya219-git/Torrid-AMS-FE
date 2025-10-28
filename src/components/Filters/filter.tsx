import { Button, Card } from "@mantine/core";
import Priority from "../Priority/priority";
import "./filter.css";
import Category from "../Category/category";
import AssignmentGroup from "../AssignmentGroup/assignmentGroup";
import Status from "../Status/status";
import TeamMembers from "../TeamMembers/teamMembers";
import Duration from "../Duration/duration";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  appliedFilter,
  filterEnabled,
  FilterState,
  resetEnabled,
  selectedFilter,
} from "../../store/filterStore";

export default function Filter() {
  const [selectedGroups, setSelectedGroups] = useAtom(selectedFilter);
  const setAppliedGroups = useSetAtom(appliedFilter);
  const isResetEnabled = useAtomValue(resetEnabled);
  const isFilterEnabled = useAtomValue(filterEnabled);

  const applyFilters = () => {
    setAppliedGroups({ ...selectedGroups });
  };

  const resetFilters = () => {
    const clearedState: FilterState = {
      AssignmentGroup: [],
      FromDate: null,
      ToDate: null,
      Category: [],
      Priority: [],
      State: [],
      AssignedToName: [],
    };

    setSelectedGroups(clearedState);
    setAppliedGroups(clearedState);
  };

  return (
    <Card padding="lg" radius="md">
      <Card.Section>
        <AssignmentGroup />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Duration />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Category />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Priority />
      </Card.Section>

      <Card.Section pb="lg">
        <Status />
      </Card.Section>

      <Card.Section pb="lg">
        <TeamMembers />
      </Card.Section>

      <div className="button-group">
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={!isResetEnabled}
        >
          Reset Filter
        </Button>
        <Button onClick={applyFilters} disabled={!isFilterEnabled}>
          Apply Filter
        </Button>
      </div>
    </Card>
  );
}
