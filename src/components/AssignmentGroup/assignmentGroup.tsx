import { Accordion, Checkbox, Collapse, Text } from "@mantine/core";
import "./assignmentGroup.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import axios from "axios";

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

  //data from API
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

  const staticGroups = assignmentGroups.slice(0, 4);

  const expandGroups = assignmentGroups.slice(4);

  const AssignmentGroupChanges = (value: string) => {
    setFilters((prev) => {
      const updatedGroups = prev.AssignmentGroup.includes(value)
        ? prev.AssignmentGroup.filter((v) => v !== value)
        : [...prev.AssignmentGroup, value];

      // Update selectAll
      setSelectAll(updatedGroups.length === assignmentGroups.length);

      return { ...prev, AssignmentGroup: updatedGroups };
    });
  };

  useEffect(() => {
    if (filters.AssignmentGroup.length === 0) {
      setSelectAll(false);
    }
  }, [filters]);

  // SelectAll
  const selectAllGroups = () => {
    const allGroupNames = assignmentGroups.map((g) => g.assignmentGroupName);
    setFilters((prev) => ({ ...prev, AssignmentGroup: allGroupNames }));
    setSelectAll(true);
  };

  // Deselect
  const deselectAllGroups = () => {
    setFilters((prev) => ({ ...prev, AssignmentGroup: [] }));
    setSelectAll(false);
  };

  // Handle Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      deselectAllGroups();
    } else {
      selectAllGroups();
    }
  };

  return (
    <Accordion defaultValue="group" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="group" value="group">
        <Accordion.Control>
          <Text fw={500}>Assignment Torrid Group</Text>
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
                {expandGroups.map((assignmentGroup) => (
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
            {opened ? "View Less" : "View More (" + expandGroups.length + "+)"}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
