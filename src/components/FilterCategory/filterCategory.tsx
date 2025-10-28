import { useAtomValue, useSetAtom } from "jotai";
import "./filterCategory.css";
import { Card } from "@mantine/core";
import {
  appliedFilter,
  FilterChip,
  filterChips,
  FilterState,
  resetEnabled,
  selectedFilter,
} from "../../store/filterStore";

export default function FilterCategory() {
  const appliedFilterChips = useAtomValue(filterChips);
  const setAppliedFilters = useSetAtom(appliedFilter);
  const setSelectedFilters = useSetAtom(selectedFilter);

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
    setAppliedFilters((prev) => {
      return getUpdatedFilterState(prev, chip);
    });
    setSelectedFilters((prev) => {
      return getUpdatedFilterState(prev, chip);
    });
  };

  const getUpdatedFilterState = (prev: FilterState, chip: FilterChip) => {
    if (chip.key === "AssignmentGroup") {
      return {
        ...prev,
        AssignmentGroup: prev.AssignmentGroup.filter(
          (value) => value !== chip.value
        ),
      };
    }
    if (chip.key === "Category") {
      return {
        ...prev,
        Category: prev.Category.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "FromDate") {
      return {
        ...prev,
        FromDate: null,
      };
    }
    if (chip.key === "ToDate") {
      return {
        ...prev,
        ToDate: null,
      };
    }
    if (chip.key === "Priority") {
      return {
        ...prev,
        Priority: prev.Priority.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "State") {
      return {
        ...prev,
        State: prev.State.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "AssignedToName") {
      return {
        ...prev,
        AssignedToName: prev.AssignedToName.filter(
          (value) => value !== chip.value
        ),
      };
    }
    return prev;
  };

  //Clear All is visible only appliedGroup have filter
  const activeFilters = useAtomValue(resetEnabled);

  return (
    <Card className="category-result" withBorder>
      <Card.Section inheritPadding>
        <div className="selected-filter">
          <div className="filtered-results">
            <h2>Filtered Results</h2>
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
