import { Accordion, Checkbox, Input, Text } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { List, RowComponentProps } from "react-window";
import { selectedTeamMembers } from "../../store/filterStore";
import { TeamMember } from "./team-members.interface";
import "./teamMembers.css";

export default function TeamMembers() {
  const [selectedFilters, setSelectedFilters] = useAtom(selectedTeamMembers);
  const [searchText, setSearchText] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/nameandcountbypriority")
      .then((res) => {
        setTeamMembers(res.data?.memberDetails ?? []);
      })
      .catch((err) => {
        console.error("Error fetching team members:", err);
        setTeamMembers([]);
      });
  }, []);

  const filteredMembers = useMemo(() => {
    return searchText
      ? teamMembers.filter((member) =>
          member.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : teamMembers;
  }, [teamMembers, searchText]);

  const onCheckboxChange = useCallback((value: string) => {
    setSelectedFilters((prev) => {
      return prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
    });
  }, []);

  return (
    <Accordion defaultValue="teamMembers">
      <Accordion.Item key="teamMembers" value="teamMembers">
        <Accordion.Control>
          <Text fw={700}>Assigned Team Members</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="search">
            <Input
              placeholder="Search team members..."
              leftSection={<SearchIcon fontSize="medium" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <List
            rowComponent={AssignedTeamMember}
            rowCount={filteredMembers.length}
            rowHeight={37}
            rowProps={{ filteredMembers, onCheckboxChange, selectedFilters }}
            className="team-member-scroll"
          />

          {searchText && filteredMembers.length === 0 && (
            <Text c="dimmed" size="sm">
              No match found for "{searchText}"
            </Text>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function AssignedTeamMember({
  index,
  filteredMembers,
  onCheckboxChange,
  selectedFilters,
  style,
}: RowComponentProps<{
  filteredMembers: TeamMember[];
  onCheckboxChange: (value: string) => void;
  selectedFilters: string[];
}>) {
  return (
    <div
      className="team-member-checkbox"
      key={filteredMembers[index].name}
      style={style}
    >
      <Checkbox
        label={filteredMembers[index].name}
        onChange={() => onCheckboxChange(filteredMembers[index].name)}
        checked={selectedFilters.includes(filteredMembers[index].name)}
      />
      <Text c="dimmed">{filteredMembers[index].totalCount}</Text>
    </div>
  );
}
