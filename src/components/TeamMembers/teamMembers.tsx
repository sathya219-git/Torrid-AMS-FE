import { Accordion, Checkbox, Input, Text } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectedFilter } from "../../store/filterStore";
import "./teamMembers.css";

export default function TeamMembers() {
  type TeamMember = {
    name: string;
    totalCount: number;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [searchText, setSearchText] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/nameandcountbypriority")
      .then((res) => {
        setTeamMembers(res.data?.memberDetails);
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

  const teamMembersChanges = useCallback((value: string) => {
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

          <div className="team-member-scroll">
            {filteredMembers.map((teamMember) => (
              <div className="team-member-checkbox" key={teamMember.name}>
                <Checkbox
                  label={teamMember.name}
                  onChange={() => teamMembersChanges(teamMember.name)}
                  checked={filters.AssignedToName.includes(teamMember.name)}
                />
                <Text c="dimmed">{teamMember.totalCount}</Text>
              </div>
            ))}
          </div>

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
