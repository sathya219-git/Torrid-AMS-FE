import { Button, Card } from "@mantine/core";
import Priority from "../Priority/priority";
import "./filter.css";
import Category from "../Category/category";
import AssignmentGroup from "../AssignmentGroup/assignmentGroup";
import Status from "../Status/status";
import TeamMembers from "../TeamMembers/teamMembers";
import Duration from "../Duration/duration";

export default function Filter() {
  return (
    <Card padding="lg" radius="md">
      <Card.Section>
        <AssignmentGroup />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Duration />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Category />
      </Card.Section>

      <Card.Section inheritPadding pb="lg">
        <Priority />
      </Card.Section>

      <Card.Section pb="lg">
        <Status />
      </Card.Section>

      <Card.Section pb="lg">
        <TeamMembers />
      </Card.Section>

      <div className="button-group">
        <Button variant="outline">Reset Filter</Button>
        <Button>Apply Filter</Button>
      </div>
    </Card>
  );
}
