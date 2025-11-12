import { Accordion, Checkbox, Collapse, Text } from "@mantine/core";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectedFilter } from "../../store/filterStore";
import "./assignmentGroup.css";

export default function AssignmentGroup() {
  type AssignmentGroup = {
    assignmentGroupName: string;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [opened, setOpened] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [assignmentGroups, setAssignmentGroups] = useState<AssignmentGroup[]>(
    []
  );

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/assignmentgroups")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAssignmentGroups(data);
      })
      .catch((err) => {
        console.error("Error fetching category counts:", err);
        setAssignmentGroups([]);
      });
  }, []);

  const staticGroups = useMemo(() => {
    return assignmentGroups.slice(0, 4);
  }, [assignmentGroups]);

  const expandedGroups = useMemo(() => {
    return assignmentGroups.slice(4);
  }, [assignmentGroups]);

  const AssignmentGroupChanges = useCallback(
    (value: string) => {
      setFilters((prev) => {
        const updatedGroups = prev.AssignmentGroup.includes(value)
          ? prev.AssignmentGroup.filter((v) => v !== value)
          : [...prev.AssignmentGroup, value];

        // Update selectAll
        setSelectAll(updatedGroups.length === assignmentGroups.length);

        return { ...prev, AssignmentGroup: updatedGroups };
      });
    },
    [assignmentGroups]
  );

  useEffect(() => {
    if (filters.AssignmentGroup.length === 0) {
      setSelectAll(false);
    }
  }, [filters]);

  const selectAllGroups = useCallback(() => {
    const allGroupNames = assignmentGroups.map((g) => g.assignmentGroupName);
    setFilters((prev) => ({ ...prev, AssignmentGroup: allGroupNames }));
    setSelectAll(true);
  }, [assignmentGroups]);

  const deselectAllGroups = useCallback(() => {
    setFilters((prev) => ({ ...prev, AssignmentGroup: [] }));
    setSelectAll(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      deselectAllGroups();
    } else {
      selectAllGroups();
    }
  }, [selectAll]);

  return (
    <Accordion defaultValue="group" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="group" value="group">
        <Accordion.Control>
          <Text fw={700}>Assignment Torrid Group</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="select-all">
            <Checkbox
              label="Select All Groups"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </div>
          <div className="assignment-content">
            {staticGroups.map((assignmentGroup) => (
              <div
                className="group-checkbox"
                key={assignmentGroup.assignmentGroupName}
              >
                <Checkbox
                  label={assignmentGroup.assignmentGroupName}
                  onChange={() =>
                    AssignmentGroupChanges(assignmentGroup.assignmentGroupName)
                  }
                  checked={filters.AssignmentGroup.includes(
                    assignmentGroup.assignmentGroupName
                  )}
                />
              </div>
            ))}
          </div>
          <div
            className={
              opened
                ? "assignment-content-expanded"
                : "assignment-content-collapsed"
            }
          >
            <Collapse in={opened}>
              <div className="assignment-content">
                {expandedGroups.map((assignmentGroup) => (
                  <div
                    className="group-checkbox"
                    key={assignmentGroup.assignmentGroupName}
                  >
                    <Checkbox
                      label={assignmentGroup.assignmentGroupName}
                      onChange={() =>
                        AssignmentGroupChanges(
                          assignmentGroup.assignmentGroupName
                        )
                      }
                      checked={filters.AssignmentGroup.includes(
                        assignmentGroup.assignmentGroupName
                      )}
                    />
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
          <Text className="view" onClick={() => setOpened((prev) => !prev)}>
            {opened
              ? "View Less"
              : "View More (" + expandedGroups.length + "+)"}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
