import { useAtom, useAtomValue, useSetAtom } from "jotai";
import "./filterCategory.css";
import { Card, Text } from "@mantine/core";
import {
  appliedFilter,
  FilterKeys,
  FilterState,
  resetEnabled,
  selectedFilter,
} from "../../store/filterStore";
import { useEffect } from "react";

export default function FilterCategory() {
  const [appliedGroups, setAppliedGroups] = useAtom(appliedFilter);
  const setSelectedGroups = useSetAtom(selectedFilter);

  useEffect(() => {
    console.log("Applied Filters:", appliedGroups);
    console.log(" selected Filters", selectedFilter);
  }, [appliedGroups]);

  const clearAll = () => {
    const clearedState: FilterState = {
      assignmentGroup: [],
      duration: {
        from: null,
        to: null,
      },
      category: [],
      incidentPriority: [],
      status: [],
      teamMember: [],
    };
    setAppliedGroups(clearedState);
    setSelectedGroups(clearedState);

    console.log(" Cleared all filters ");
  };

  const handleRemoveFilter = (key: FilterKeys, value: string) => {
    console.log(`Removing ${value} from ${key}`);

    setAppliedGroups((prev) => {
      const updated = { ...prev };
      if (key === "duration") {
        if (value === "from") {
          updated.duration = { ...prev.duration, from: null };
        } else if (value === "to") {
          updated.duration = { ...prev.duration, to: null };
        }
      } else if (Array.isArray(prev[key])) {
        updated[key] = (prev[key] as string[]).filter((v) => v !== value);
      }
      console.log("Updated appliedGroups:", updated);
      return updated;
    });

    setSelectedGroups((prev) => {
      const updated = { ...prev };
      if (key === "duration") {
        if (value === "from") {
          updated.duration = { ...prev.duration, from: null };
        } else if (value === "to") {
          updated.duration = { ...prev.duration, to: null };
        }
      } else if (Array.isArray(prev[key])) {
        updated[key] = (prev[key] as string[]).filter((v) => v !== value);
      }
      console.log("Updated selectedGroups:", updated);
      return updated;
    });
  };

  //Clear All is visible only appliedGroup have filter
  const activeFilters = useAtomValue(resetEnabled);


  return (
    <Card className="category-result" withBorder>
      <Card.Section inheritPadding>
        <div className="selected-filter">
          <Text fw={500} size="xl">
            <div className="filtered-results">
              <h2>Filtered Results</h2>
              <div className="filter-tags">
                {Object.entries(appliedGroups).map(([key, values]) =>
                  Array.isArray(values)
                    ? values.map((value) => (
                        <div className="tag" key={`${key}-${value}`}>
                          <span>{value}</span>
                          <button
                            className="close-btn"
                            onClick={() =>
                              handleRemoveFilter(key as FilterKeys, value)
                            }
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    : null
                )}

                {appliedGroups.duration.from && (
                  <div className="tag" key="from-date">
                    <span>
                      From:{" "}
                      {appliedGroups.duration.from.toLocaleDateString("en-GB")}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => handleRemoveFilter("duration", "from")}
                    >
                      &times;
                    </button>
                  </div>
                )}

                {appliedGroups.duration.to && (
                  <div className="tag" key="to-date">
                    <span>
                      To:{" "}
                      {appliedGroups.duration.to.toLocaleDateString("en-GB")}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => handleRemoveFilter("duration", "to")}
                    >
                      &times;
                    </button>
                  </div>
                )}

                {activeFilters && (
                  <span className="clear-all" onClick={clearAll}>
                    Clear All
                  </span>
                )}
              </div>
            </div>
          </Text>
        </div>
      </Card.Section>
    </Card>
  );
}
