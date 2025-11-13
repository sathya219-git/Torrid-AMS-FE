import { Accordion, Checkbox, Input, Text } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { List, RowComponentProps } from "react-window";
import { FilterState, selectedFilter } from "../../store/filterStore";
import { TeamMember } from "./team-members.interface";
import "./teamMembers.css";

export default function TeamMembers() {
  const [filters, setFilters] = useAtom(selectedFilter);
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
          member.name?.toLowerCase().includes(searchText.toLowerCase())
        )
      : teamMembers;
  }, [teamMembers, searchText]);

  const onCheckboxChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      AssignedToName: prev.AssignedToName.includes(value)
        ? prev.AssignedToName.filter((v) => v !== value)
        : [...prev.AssignedToName, value],
    }));
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
            rowCount={teamMembers.length}
            rowHeight={37}
            rowProps={{ teamMembers, onCheckboxChange, filters }}
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
  teamMembers,
  onCheckboxChange,
  filters,
  style,
}: RowComponentProps<{
  teamMembers: TeamMember[];
  onCheckboxChange: (value: string) => void;
  filters: FilterState;
}>) {
  return (
    <div
      className="team-member-checkbox"
      key={teamMembers[index].name}
      style={style}
    >
      <Checkbox
        label={teamMembers[index].name}
        onChange={() => onCheckboxChange(teamMembers[index].name)}
        checked={filters.AssignedToName.includes(teamMembers[index].name)}
      />
      <Text c="dimmed">{teamMembers[index].totalCount}</Text>
    </div>
  );
}
