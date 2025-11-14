import { Accordion, Checkbox, Collapse, Text } from "@mantine/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { groups, InitiateAPI, selectedGroups } from "../../store/filterStore";
import "./assignmentGroup.css";

export default function AssignmentGroup() {
  const assignmentGroups = useAtomValue(groups);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedGroups);

  const initiateAPI = useSetAtom(InitiateAPI);

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (assignmentGroups.length > 0) {
      return;
    }
    initiateAPI({url:"http://localhost:5092/api/Incident/assignmentgroups",method:"GET",body:null});
  }, []);

  const staticGroups = useMemo(() => {
    return assignmentGroups.slice(0, 4);
  }, [assignmentGroups]);

  const expandedGroups = useMemo(() => {
    return assignmentGroups.slice(4);
  }, [assignmentGroups]);

  const selectAll = useMemo(() => {
    return selectedFilters.length === assignmentGroups.length;
  }, [selectedFilters, assignmentGroups]);

  const onCheckboxChange = useCallback(
    (value: string) => {
      setSelectedFilters((prev) => {
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      });
    },
    [assignmentGroups]
  );

  const selectAllGroups = useCallback(() => {
    setSelectedFilters(assignmentGroups);
  }, [assignmentGroups]);

  const deselectAllGroups = useCallback(() => {
    setSelectedFilters([]);
  }, []);

  const onSelectAll = useCallback(() => {
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
              onChange={onSelectAll}
            />
          </div>
          <div className="assignment-content">
            {staticGroups.map((assignmentGroupName) => (
              <div className="group-checkbox" key={assignmentGroupName}>
                <Checkbox
                  label={assignmentGroupName}
                  onChange={() => onCheckboxChange(assignmentGroupName)}
                  checked={selectedFilters.includes(assignmentGroupName)}
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
                {expandedGroups.map((assignmentGroupName) => (
                  <div className="group-checkbox" key={assignmentGroupName}>
                    <Checkbox
                      label={assignmentGroupName}
                      onChange={() => onCheckboxChange(assignmentGroupName)}
                      checked={selectedFilters.includes(assignmentGroupName)}
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
