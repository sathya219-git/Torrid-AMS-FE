import { Button, Card } from "@mantine/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { FilterState } from "../../store/filter-store.interface";
import {
  appliedFilter,
  filterEnabled,
  resetEnabled,
  selectedCategories,
  selectedFromDate,
  selectedGroups,
  selectedStatus,
  selectedTeamMembers,
  selectedToDate,
} from "../../store/filterStore";
import AssignmentGroup from "../AssignmentGroup/assignmentGroup";
import Category from "../Category/category";
import Duration from "../Duration/duration";
import Status from "../Status/status";
import TeamMembers from "../TeamMembers/teamMembers";
import "./filter.css";

export default function Filter() {
  const [selGroups, setSelectedGroups] = useAtom(selectedGroups);
  const [selFromDate, setSelectedFromDate] = useAtom(selectedFromDate);
  const [selToDate, setSelectedToDate] = useAtom(selectedToDate);
  const [selCategories, setSelectedCategories] = useAtom(selectedCategories);
  const [selStatus, setSelectedStatus] = useAtom(selectedStatus);
  const [selTeamMembers, setSelectedTeamMembers] = useAtom(selectedTeamMembers);

  const setAppliedGroups = useSetAtom(appliedFilter);

  const isResetEnabled = useAtomValue(resetEnabled);
  const isFilterEnabled = useAtomValue(filterEnabled);

  const applyFilters = useCallback(() => {
    setAppliedGroups({
      AssignmentGroup: selGroups,
      FromDate: selFromDate,
      ToDate: selToDate,
      Category: selCategories,
      State: selStatus,
      AssignedToName: selTeamMembers,
      UpdatedOn: new Date().getTime(),
    });
  }, [
    selGroups,
    selFromDate,
    selToDate,
    selCategories,
    selStatus,
    selTeamMembers,
  ]);

  const resetFilters = useCallback(() => {
    const clearedState: FilterState = {
      AssignmentGroup: [],
      FromDate: null,
      ToDate: null,
      Category: [],
      State: [],
      AssignedToName: [],
      UpdatedOn: new Date().getTime(),
    };

    setSelectedGroups([]);
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSelectedCategories([]);
    setSelectedStatus([]);
    setSelectedTeamMembers([]);

    setAppliedGroups(clearedState);
  }, []);

  return (
    <Card padding="lg" radius="md">
      <Card.Section pb="lg">
        <AssignmentGroup />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Duration />
      </Card.Section>

      <Card.Section pb="lg">
        <Category />
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
        <Button
          variant="filled"
          onClick={applyFilters}
          disabled={!isFilterEnabled}
        >
          Apply Filter
        </Button>
      </div>
    </Card>
  );
}
