import { Accordion, Checkbox, Collapse, Text } from "@mantine/core";
import "./assignmentGroup.css";
import { useState } from "react";

export default function AssignmentGroup() {
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

  const [opened, setOpened] = useState(false);

  return (
    <Accordion defaultValue="group" classNames={{ item: "accordion-border" }}>
      <Accordion.Item key="group" value="group">
        <Accordion.Control>
          <Text fw={500}>Assignment Torrid Group</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="select-all">
            <Checkbox label="Select All Groups" />
          </div>
          <div className="assignment-content">
            {staticGroups.map((assignmentGroup) => (
              <div className="group-checkbox" key={assignmentGroup.name}>
                <Checkbox label={assignmentGroup.name} />
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
                    <Checkbox label={assignmentGroup.name} />
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
