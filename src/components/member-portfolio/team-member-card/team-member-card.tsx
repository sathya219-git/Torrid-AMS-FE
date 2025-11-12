import { MemberDetails } from "../member-portfolio.interface";
import "./team-member-card.css";

export default function TeamMemberCard({ member }: { member: MemberDetails }) {
  return (
    <div className="member-card">
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-value">{member.totalCount}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.name ?? "Null"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.p1}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.p2}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.p3}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.p4}</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{member.actualResolvedTime}</span>
        </div>
      </div>
    </div>
  );
}
