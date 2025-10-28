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

  // const TeamMembers = [
  //   { name: "Akash Kumar", count: 29 },
  //   { name: "Anjali Sharma", count: 31 },
  //   { name: "Rahul Verma", count: 27 },
  //   { name: "Sneha Iyer", count: 30 },
  //   { name: "Rohit Mehta", count: 26 },
  //   { name: "Priya Nair", count: 33 },
  //   { name: "Vikram Singh", count: 25 },
  //   { name: "Kiran Patel", count: 28 },
  //   { name: "Nisha Reddy", count: 32 },
  //   { name: "Arjun Das", count: 29 },
  //   { name: "Deepa Menon", count: 30 },
  //   { name: "Sanjay Gupta", count: 31 },
  //   { name: "Amit Thakur", count: 27 },
  //   { name: "Pooja Mishra", count: 28 },
  //   { name: "Vivek Raj", count: 26 },
  //   { name: "Neha Sinha", count: 33 },
  //   { name: "Gaurav Yadav", count: 29 },
  //   { name: "Manisha Paul", count: 30 },
  //   { name: "Karthik R", count: 31 },
  //   { name: "Ritu Chauhan", count: 28 },
  //   { name: "Abhishek Tiwari", count: 32 },
  //   { name: "Divya Jain", count: 27 },
  //   { name: "Sandeep Kumar", count: 25 },
  //   { name: "Meena Joseph", count: 29 },
  //   { name: "Rajesh Patel", count: 28 },
  //   { name: "Simran Kaur", count: 31 },
  //   { name: "Aditya Malhotra", count: 30 },
  //   { name: "Swathi Rao", count: 26 },
  //   { name: "Rakesh B", count: 33 },
  //   { name: "Tanya Kapoor", count: 29 },
  //   { name: "Mohit Chauhan", count: 30 },
  //   { name: "Isha Gupta", count: 28 },
  //   { name: "Harish Menon", count: 27 },
  //   { name: "Chirag Joshi", count: 31 },
  //   { name: "Anita Pillai", count: 25 },
  //   { name: "Sumit Sharma", count: 32 },
  //   { name: "Komal Agarwal", count: 29 },
  //   { name: "Ajay Reddy", count: 28 },
  //   { name: "Roshni Das", count: 30 },
  //   { name: "Sourav Sen", count: 31 },
  //   { name: "Kavya N", count: 27 },
  //   { name: "Naveen Thomas", count: 33 },
  // ];

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
                  onClick={() => teamMembersChanges(teamMember.name)}
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
