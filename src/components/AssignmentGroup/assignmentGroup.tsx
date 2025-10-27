import { Accordion, Checkbox, Collapse, Text } from "@mantine/core";
import "./assignmentGroup.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";

export default function AssignmentGroup() {
  const [filters, setFilters] = useAtom(selectedFilter);
  const [opened, setOpened] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const assignmentGroups = [
    { name: "Web Support" },
    { name: "Management Team" },
    { name: "Store Support" },
    { name: "Ops Team" },
    { name: "Test 1" },
    { name: "Test 2" },
    { name: "Test 3" },
    { name: "Test 4" },
    { name: "Test 5" },
    { name: "Test 6" },
    { name: "Test 7" },
  ];

  const staticGroups = assignmentGroups.slice(0, 4);

  const expandGroups = assignmentGroups.slice(4);

  const AssignmentGroupChanges = (value: string) => {
    setFilters((prev) => {
      const updatedGroups = prev.assignmentGroup.includes(value)
        ? prev.assignmentGroup.filter((v) => v !== value)
        : [...prev.assignmentGroup, value];

      // Update selectAll
      setSelectAll(updatedGroups.length === assignmentGroups.length);

      return { ...prev, assignmentGroup: updatedGroups };
    });
  };

  useEffect(() => {
    if (filters.assignmentGroup.length === 0) {
      setSelectAll(false);
    }
    console.log(filters);
  }, [filters]);

  // SelectAll
  const selectAllGroups = () => {
    const allGroupNames = assignmentGroups.map((g) => g.name);
    setFilters((prev) => ({ ...prev, assignmentGroup: allGroupNames }));
    setSelectAll(true);
  };

  // Deselect
  const deselectAllGroups = () => {
    setFilters((prev) => ({ ...prev, assignmentGroup: [] }));
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
              <div className="group-checkbox" key={assignmentGroup.name}>
                <Checkbox
                  label={assignmentGroup.name}
                  onChange={() => AssignmentGroupChanges(assignmentGroup.name)}
                  checked={filters.assignmentGroup.includes(
                    assignmentGroup.name
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
                  <div className="group-checkbox" key={assignmentGroup.name}>
                    <Checkbox
                      label={assignmentGroup.name}
                      onChange={() =>
                        AssignmentGroupChanges(assignmentGroup.name)
                      }
                      checked={filters.assignmentGroup.includes(
                        assignmentGroup.name
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
