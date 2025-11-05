import { useAtomValue, useSetAtom } from "jotai";
import "./filterCategory.css";
import { Card } from "@mantine/core";
import {
  appliedFilter,
  FilterChip,
  filterChips,
  filterState,
  FilterState,
  resetEnabled,
  selectedFilter,
} from "../../store/filterStore";
import { colors } from "@mui/material";

export default function FilterCategory() {
  const appliedFilterChips = useAtomValue(filterChips);
  const setAppliedFilters = useSetAtom(appliedFilter);
  const setSelectedFilters = useSetAtom(selectedFilter);
  const activeFilters = useAtomValue(resetEnabled);
  const filterOpened = useAtomValue(filterState);

  const clearAll = () => {
    const clearedState: FilterState = {
      AssignmentGroup: [],
      FromDate: null,
      ToDate: null,
      Category: [],
      Priority: [],
      State: [],
      AssignedToName: [],
    };
    setAppliedFilters(clearedState);
    setSelectedFilters(clearedState);
  };

  const handleRemoveFilter = (chip: FilterChip) => {
    setAppliedFilters((prev) => getUpdatedFilterState(prev, chip));
    setSelectedFilters((prev) => getUpdatedFilterState(prev, chip));
  };

  const getUpdatedFilterState = (prev: FilterState, chip: FilterChip) => {
    switch (chip.key) {
      case "AssignmentGroup":
        return { ...prev, AssignmentGroup: prev.AssignmentGroup.filter(v => v !== chip.value) };
      case "Category":
        return { ...prev, Category: prev.Category.filter(v => v !== chip.value) };
      case "FromDate":
        return { ...prev, FromDate: null };
      case "ToDate":
        return { ...prev, ToDate: null };
      case "Priority":
        return { ...prev, Priority: prev.Priority.filter(v => v !== chip.value) };
      case "State":
        return { ...prev, State: prev.State.filter(v => v !== chip.value) };
      case "AssignedToName":
        return { ...prev, AssignedToName: prev.AssignedToName.filter(v => v !== chip.value) };
      default:
        return prev;
    }
  };

  return (
    <Card
      className={`category-result ${filterOpened ? "opened" : "closed"}`}
      withBorder
    >
      <Card.Section inheritPadding>
        <div className="selected-filter">
          <div className="filtered-results">
            <h1 style={{color:"#333B69",paddingLeft:"10px"}}>Filtered Results</h1>
            <div className="filter-tags">
              {appliedFilterChips.map((chip) => (
                <div className="tag" key={chip.value}>
                  <span>{chip.value}</span>
                  <button
                    className="close-btn"
                    onClick={() => handleRemoveFilter(chip)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {activeFilters && (
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
