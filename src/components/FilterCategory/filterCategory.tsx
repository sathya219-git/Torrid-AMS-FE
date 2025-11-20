import { Card } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { FilterChip, FilterState } from "../../store/filter-store.interface";
import {
  appliedFilter,
  filterChips,
  filterState,
  resetEnabled,
  selectedCategories,
  selectedFromDate,
  selectedGroups,
  selectedStatus,
  selectedTeamMembers,
  selectedToDate,
} from "../../store/filterStore";
import "./filterCategory.css";

export default function FilterCategory() {
  const setSelectedGroups = useSetAtom(selectedGroups);
  const setSelectedFromDate = useSetAtom(selectedFromDate);
  const setSelectedToDate = useSetAtom(selectedToDate);
  const setSelectedCategories = useSetAtom(selectedCategories);
  const setSelectedStatus = useSetAtom(selectedStatus);
  const setSelectedTeamMembers = useSetAtom(selectedTeamMembers);
  const setAppliedFilters = useSetAtom(appliedFilter);
  const appliedFilterChips = useAtomValue(filterChips);
  const hasActiveFilters = useAtomValue(resetEnabled);
  const filterOpened = useAtomValue(filterState);

  const clearAll = useCallback(() => {
    const clearedState: FilterState = {
      AssignmentGroup: [],
      FromDate: null,
      ToDate: null,
      Category: [],
      State: [],
      AssignedToName: [],
      UpdatedOn: new Date().getTime(),
    };

    setAppliedFilters(clearedState);
    setSelectedGroups([]);
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSelectedCategories([]);
    setSelectedStatus([]);
    setSelectedTeamMembers([]);
  }, []);

  const handleRemoveFilter = useCallback((chip: FilterChip) => {
    setAppliedFilters((prev) => getUpdatedFilterState(prev, chip));
    updateFilterState(chip);
  }, []);

  const updateFilterState = useCallback((chip: FilterChip) => {
    switch (chip.key) {
      case "AssignmentGroup":
        setSelectedGroups((prev) => prev.filter((v) => v !== chip.value));
        break;
      case "Category":
        setSelectedCategories((prev) => prev.filter((v) => v !== chip.value));
        break;
      case "FromDate":
        setSelectedFromDate(null);
        break;
      case "ToDate":
        setSelectedToDate(null);
        break;
      case "State":
        setSelectedStatus((prev) => prev.filter((v) => v !== chip.value));
        break;
      case "AssignedToName":
        setSelectedTeamMembers((prev) => prev.filter((v) => v !== chip.value));
        break;
    }
  }, []);

  const getUpdatedFilterState = useCallback(
    (prev: FilterState, chip: FilterChip) => {
      switch (chip.key) {
        case "AssignmentGroup":
          return {
            ...prev,
            AssignmentGroup: prev.AssignmentGroup.filter(
              (v) => v !== chip.value
            ),
            UpdatedOn: new Date().getTime(),
          };
        case "Category":
          return {
            ...prev,
            Category: prev.Category.filter((v) => v !== chip.value),
            UpdatedOn: new Date().getTime(),
          };
        case "FromDate":
          return { ...prev, FromDate: null, UpdatedOn: new Date().getTime() };
        case "ToDate":
          return { ...prev, ToDate: null, UpdatedOn: new Date().getTime() };
        case "State":
          return {
            ...prev,
            State: prev.State.filter((v) => v !== chip.value),
            UpdatedOn: new Date().getTime(),
          };
        case "AssignedToName":
          return {
            ...prev,
            AssignedToName: prev.AssignedToName.filter((v) => v !== chip.value),
            UpdatedOn: new Date().getTime(),
          };
        default:
          return prev;
      }
    },
    []
  );

  // ✅ Show header only if we have non-null filters
  const hasValidFilters = appliedFilterChips?.some(
    (item) =>
      item?.value !== null && item?.value !== "" && item?.value !== undefined
  );

  return (
    <Card
      className={`category-result ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section inheritPadding>
        <div className="selected-filter">
          <div className="filtered-results">
            {/* ✅ Conditional Header */}
            {hasValidFilters && (
              <h1
                style={{
                  color: "#333B69",
                  paddingLeft: "10px",
                  fontWeight: "600",
                  fontSize: "22px",
                }}
              >
                Filtered Results
              </h1>
            )}

            <div className="filter-tags">
              {/* ✅ Render only non-null chips */}
              {appliedFilterChips.map((chip) =>
                chip.value ? (
                  <div className="tag" key={chip.value}>
                    <span>{chip.value}</span>
                    <button
                      className="close-btn"
                      onClick={() => handleRemoveFilter(chip)}
                    >
                      &times;
                    </button>
                  </div>
                ) : null
              )}

              {hasActiveFilters && (
                <span className="clear-all" onClick={clearAll}>
                  Clear All
                </span>
              )}
            </div>
          </div>
        </div>
      </Card.Section>
    </Card>
  );
}
