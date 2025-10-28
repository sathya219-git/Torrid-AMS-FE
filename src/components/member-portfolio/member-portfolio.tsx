import { Member } from "./member";
import "./member-portfolio.css";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";

// Data structure (moved inside the component for simplicity in this example)
const teamData: Member[] = [
  {
    id: 48,
    name: "Alice Johnson",
    p1Critical: 30,
    p2High: 8,
    p3Moderate: 0,
    p4Low: 10,
    avgResolvedTime: "132 Weeks",
    timeTrend: "up",
  },
  {
    id: 40,
    name: "Jamie Smith",
    p1Critical: 25,
    p2High: 15,
    p3Moderate: 0,
    p4Low: 0,
    avgResolvedTime: "127 Weeks",
    timeTrend: "down",
  },
  {
    id: 32,
    name: "Michael Smith",
    p1Critical: 8,
    p2High: 4,
    p3Moderate: 7,
    p4Low: 13,
    avgResolvedTime: "92 Weeks",
    timeTrend: "down",
  },
  {
    id: 28,
    name: "April Aurora",
    p1Critical: 14,
    p2High: 4,
    p3Moderate: 7,
    p4Low: 3,
    avgResolvedTime: "62 Weeks",
    timeTrend: "down",
  },
  {
    id: 41,
    name: "Jamie Smith",
    p1Critical: 25,
    p2High: 15,
    p3Moderate: 0,
    p4Low: 0,
    avgResolvedTime: "127 Weeks",
    timeTrend: "down",
  },
];

// Individual team member component (Optional, but good practice)
const TeamMemberCard = ({ member }: { member: Member }) => (
  <div className="member-card">
    <div className="member-info">
      {/* Note: The class name uses the hyphenated version for consistency with the CSS */}
      <div className="member-id-circle">{member.id}</div>
      <div className="member-name">{member.name}</div>
    </div>

    <div className="metrics-grid">
      <div className="metric-item">
        <span className="metric-label">P1-Critical</span>
        <span className="metric-value">{member.p1Critical}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P2-High</span>
        <span className="metric-value">{member.p2High}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P3-Moderate</span>
        <span className="metric-value">{member.p3Moderate}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P4-Low</span>
        <span className="metric-value">{member.p4Low}</span>
      </div>
    </div>

    <div className="avg-resolved-time">
      <span className="avg-label">Avg Resolved Time</span>
      <span
        className={`avg-value ${
          member.timeTrend === "up" ? "trend-up" : "trend-down"
        }`}
      >
        {member.avgResolvedTime}
        {/* Using simple text/symbols for the trend icon, corresponding to the CSS color */}
        {/* <span className="trend-icon">
          {member.timeTrend === "up" ? (
            <FaArrowCircleDown fill="#C10041" height="15px" width="15px" />
          ) : (
            <FaCircleArrowUp fill="#00AB7F" height="15px" width="15px" />
          )}
        </span> */}
      </span>
    </div>
  </div>
);

export default function MemberPortfolio() {
  return (
    <div className="team-portfolio-container">
      {/* Header with Title and Controls */}
      <header className="portfolio-header">
        <h1 style={{ color: "#333B69" }}>Team Member Portfolio</h1>
        <div className="controls">
          <label>
            <b>Metrics in:</b>
          </label>
          <select className="restore-arrow" defaultValue="Weeks">
            <option className="restore-arrow">Weeks</option>
            <option className="restore-arrow">Days</option>
          </select>
          <label>
            <b>Sort by:</b>
          </label>
          <select className="restore-arrow" defaultValue="Recently Updated">
            <option className="restore-arrow">Recently Updated</option>
            <option className="restore-arrow">Alphabetical</option>
          </select>
        </div>
      </header>

      {/* Main List of Member Cards */}
      <main className="member-list">
        {teamData.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </main>

      {/* Footer with Paging Info */}
      <footer className="portfolio-footer">
        <span>Showing 1-4 of 11</span>
        <div className="pagination">
          {/* Using simple buttons for pagination */}
          <button
            style={{
              borderRadius: "6px 0 0 6px",
              border: " 1px solid #33303111",
            }}
            className="page-control"
            disabled
          >
            <img src={forward} />
            <img src={forward} />
          </button>
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            disabled
          >
            <img src={forward} />
          </button>
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
          >
            <img src={backward} />
          </button>
          <button
            style={{
              borderRadius: "0 6px 6px 0",
              border: " 1px solid #33303111",
            }}
            className="page-control"
          >
            <img src={backward} />
            <img src={backward} />
          </button>
        </div>
      </footer>
    </div>
  );
}
