import { PriorityStats } from "../cards.interface";

export default function IncidentPriorityDetailsCard({
  label,
  totalResolvedTime,
  avgResolvedTime,
  breachedCount,
  stats,
}: {
  label: string;
  totalResolvedTime: string;
  avgResolvedTime: string;
  breachedCount:number|string;
  stats: PriorityStats | undefined;
}) {
  return (
    <div className="priority-item">
      <div className="summary-card">
        <div className="header-section">
          <div className="priority-tag">
            <span className="priority-label">{label}</span>
            <span className="count">{stats?.totalCount ?? "—"}</span>
          </div>
          <div className="metric-group">
            <div className="metric-item">
              <span className="metric-title">Total Resolved Time</span>
              <span className="metric-value">{totalResolvedTime ?? "—"}</span>
            </div>
            <div className="metric-item">
              <span className="metric-title">Avg Resolved Time</span>
              <span className="metric-value">{avgResolvedTime ?? "—"}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", padding: "15px 0px", gap: "15px" }}>
          <div className="status-section">
            <div className="status-item">
              <span className="status-label">Open</span>
              <span className="status-count">{stats?.open ?? "—"}</span>
            </div>
            <div className="status-item">
              <span className="status-label">In Progress</span>
              <span className="status-count">{stats?.inProgress ?? "—"}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Closed</span>
              <span className="status-count">{stats?.closed ?? "—"}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Reopen</span>
              <span className="status-count">{stats?.reopen ?? "—"}</span>
            </div>
            <div className="status-item">
              <span className="status-label">On Hold</span>
              <span className="status-count">{stats?.onHold ?? "—"}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Resolved</span>
              <span className="status-count">{stats?.resolved ?? "—"}</span>
            </div>
          </div>
          <div style={{ backgroundColor: "#f15f6149", padding: "15px 10px", borderRadius: "10px", display: "flex", alignItems: "center", flexDirection: "column", flexGrow: 1 }}>
            <span className="status-label">Breached</span>
            <span className="status-count">{breachedCount ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
