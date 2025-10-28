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
      assignmentGroup: [],
      duration: {
        from: null,
        to: null,
      },
      category: [],
      priority: [],
      status: [],
      teamMember: [],
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
    if (chip.key === "assignmentGroup") {
      return {
        ...prev,
        assignmentGroup: prev.assignmentGroup.filter(
          (value) => value !== chip.value
        ),
      };
    }
    if (chip.key === "category") {
      return {
        ...prev,
        category: prev.category.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "duration.from") {
      return {
        ...prev,
        duration: {
          ...prev.duration,
          from: null,
        },
      };
    }
    if (chip.key === "duration.to") {
      return {
        ...prev,
        duration: {
          ...prev.duration,
          to: null,
        },
      };
    }
    if (chip.key === "priority") {
      return {
        ...prev,
        priority: prev.priority.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "status") {
      return {
        ...prev,
        status: prev.status.filter((value) => value !== chip.value),
      };
    }
    if (chip.key === "teamMember") {
      return {
        ...prev,
        teamMember: prev.teamMember.filter((value) => value !== chip.value),
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
