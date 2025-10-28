import { Accordion, Checkbox, Collapse, Input, Text } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import "./teamMembers.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedFilter } from "../../store/filterStore";
import axios from "axios";

export default function TeamMembers() {
  type TeamMember = {
    name: string;
    totalCount: number;
  };

  const [filters, setFilters] = useAtom(selectedFilter);
  const [opened, setOpened] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5092/api/Incident/nameandcountbypriority")
      .then((res) => {
        console.log("API response:", res.data?.memberDetails);
        setTeamMembers(res.data?.memberDetails);
      })
      .catch((err) => {
        console.error("Error fetching team members:", err);
        setTeamMembers([]);
      });
  }, []);

  const [staticTeamMembers, setStaticTeamMembers] = useState<TeamMember[]>([]);
  const [expandTeamMembers, setExpandTeamMembers] = useState<TeamMember[]>([]);

  //search
  useEffect(() => {
    const filteredMembers = searchMember
      ? teamMembers.filter((member) =>
          member.name?.toLowerCase().includes(searchMember.toLowerCase())
        )
      : teamMembers;
    setStaticTeamMembers(filteredMembers.slice(0, 8));
    setExpandTeamMembers(filteredMembers.slice(8));
  }, [searchMember, teamMembers]);

  const teamMembersChanges = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      teamMember: prev.teamMember.includes(value)
        ? prev.teamMember.filter((v) => v !== value)
        : [...prev.teamMember, value],
    }));
  };

  useEffect(() => {
    console.log(filters.teamMember);
  }, [filters]);

  return (
    <Accordion defaultValue="teamMembers">
      <Accordion.Item key="teamMembers" value="teamMembers">
        <Accordion.Control>
          <Text fw={500}>Assigned Team Members</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="search">
            <Input
              placeholder="Search here..."
              leftSection={<SearchIcon fontSize="medium" />}
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
            />
          </div>

          <div className="team-member-content">
            {staticTeamMembers.map((teamMember) => (
              <div className="team-member-checkbox" key={teamMember.name}>
                <Checkbox
                  label={teamMember.name}
                  onChange={() => teamMembersChanges(teamMember.name)}
                  checked={filters.teamMember.includes(teamMember.name)}
                />
                <Text c="dimmed">{teamMember.totalCount}</Text>
              </div>
            ))}
          </div>
          <div
            className={
              opened
                ? "team-member-content-expanded"
                : "team-member-content-collapsed "
            }
          >
            <Collapse in={opened}>
              <div className="team-member-content">
                {expandTeamMembers.map((teamMember) => (
                  <div className="team-member-checkbox" key={teamMember.name}>
                    <Checkbox
                      label={teamMember.name}
                      onClick={() => teamMembersChanges(teamMember.name)}
                      checked={filters.teamMember.includes(teamMember.name)}
                    />
                    <Text c="dimmed">{teamMember.totalCount}</Text>
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
          {expandTeamMembers.length > 0 ? (
            <Text fw={500} className="view" onClick={() => setOpened(!opened)}>
              {opened
                ? "View Less"
                : "View More (" + expandTeamMembers.length + "+)"}
            </Text>
          ) : (
            <></>
          )}
          {searchMember && staticTeamMembers.length === 0 ? (
            <Text c="dimmed" size="sm">
              No match found for "{searchMember}"
            </Text>
          ) : (
            <></>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
