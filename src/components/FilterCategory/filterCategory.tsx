import { Card } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
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

  // 🔹 View more state
  const [showAllChips, setShowAllChips] = useState(false);
  const MAX_VISIBLE_CHIPS = 4;

  // 🔹 Only valid chips
  const validChips = appliedFilterChips.filter(
    (chip) => chip.value !== null && chip.value !== ""
  );

  // 🔹 Chips to render
  const visibleChips = showAllChips
    ? validChips
    : validChips.slice(0, MAX_VISIBLE_CHIPS);

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
    setShowAllChips(false); // ✅ reset view
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

  const hasValidFilters = validChips.length > 0;

  return (
    <Card
      className={`category-result ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section inheritPadding>
        <div className="selected-filter">
          <div className="filtered-results">
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
              {/* 🔹 Render limited chips */}
              {visibleChips.map((chip) => (
                <div className="tag" key={`${chip.key}-${chip.value}`}>
                  <span>{chip.value}</span>
                  <button
                    className="close-btn"
                    onClick={() => handleRemoveFilter(chip)}
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* 🔹 View more / less */}
              {validChips.length > MAX_VISIBLE_CHIPS && (
                <span
                  className="view-more"
                  onClick={() => setShowAllChips(!showAllChips)}
                >
                  {showAllChips
                    ? "View Less"
                    : `View More (${validChips.length - MAX_VISIBLE_CHIPS})`}
                </span>
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
