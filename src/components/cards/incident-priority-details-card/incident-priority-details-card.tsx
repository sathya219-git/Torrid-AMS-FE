import { PriorityStats } from "../cards.interface";

export default function IncidentPriorityDetailsCard({
  label,
  totalCountForPriority,
  avgResolvedTime,
  totalResolvedTime,
  stateDetails,
  breachedCount,
  openMoreThan15Days,
  openLessThan15Days,
}: {
  label: string;
  stateDetails: Record<string, number>;
  totalCountForPriority: number;
  avgResolvedTime: string;
  totalResolvedTime: string;
  breachedCount: number;
  openMoreThan15Days: number;
  openLessThan15Days: number;
}) {
  return (
    <div className="priority-item">
      <div className="summary-card">
        <div className="header-section">
          <div className="priority-tag">
            <span className="priority-label">{label}</span>
            <span className="count">{totalCountForPriority ?? "—"}</span>
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "15px 0px",
            gap: "15px",
          }}
        >
          <div className="status-section">
            {Object.entries(stateDetails).map(([label, count]) => (
              <div key={label} className="status-item">
                <span className="status-label">{label}</span>
                <span className="status-count">{count ?? "—"}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#f15f6149",
              padding: "15px 10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              flexGrow: 1,
              minWidth:"140px",
              maxWidth:"140px"
            }}
          >
            <span className="status-label">Breached</span>
            <span className="status-count">{breachedCount ?? "—"}</span>
          </div>
        </div>
        <div
          style={{
            paddingBottom: "10px",
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          <span>open incidents </span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <div
            style={{
              width: "50%",
              height: "63px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              gap: "5px",
            }}
          >
            <span className="status-label">Less than or equal to 15 days</span>
            <span className="status-count">{openLessThan15Days ?? "—"}</span>
          </div>
          <div
            style={{
              width: "50%",
              height: "63px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              gap: "5px",
            }}
          >
            <span className="status-label">Greater than 15 days</span>
            <span className="status-count">{openMoreThan15Days ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
