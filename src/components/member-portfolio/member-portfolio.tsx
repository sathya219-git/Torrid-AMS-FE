import { Member } from "./member";
import "./member-portfolio.css";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { useAtomValue } from "jotai";
import { appliedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import { buildFilterQuery } from "../../utils/queryBuilder";

// 🧩 Type definitions
interface MemberDetail {
  name: string | null;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  totalCount: number;
  avgResolvedTime: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  sortBy: string;
}

interface MemberDetailsResponse {
  memberDetails: MemberDetail[];
  pagination: Pagination;
}

// 🧱 Individual member card
const TeamMemberCard = ({ member }: { member: MemberDetail }) => (
  <div className="member-card">
    <div className="member-info">
      <div className="member-id-circle">{member.totalCount}</div>
      <div className="member-name">{member.name ?? "Unknown"}</div>
    </div>

    <div className="metrics-grid">
      <div className="metric-item">
        <span className="metric-label">P1-Critical</span>
        <span className="metric-value">{member.p1}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P2-High</span>
        <span className="metric-value">{member.p2}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P3-Moderate</span>
        <span className="metric-value">{member.p3}</span>
      </div>
      <div className="metric-item">
        <span className="metric-label">P4-Low</span>
        <span className="metric-value">{member.p4}</span>
      </div>
    </div>

    <div className="avg-resolved-time">
      <span className="avg-label">Avg Resolved Time</span>
      <span className="avg-value">{member.avgResolvedTime}</span>
    </div>
  </div>
);

export default function MemberPortfolio() {
  const appliedFilters = useAtomValue(appliedFilter);

  // 🪣 React state
  const [memberDetailsSummary, setMemberDetailsSummary] =
    useState<MemberDetailsResponse | null>(null);

  // 🧭 Pagination/sorting/metrics state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>("Alphabetical");
  const [sortOrder, setSortOrder] = useState<string | null>("ascending");
  const [metricsUnit, setMetricsUnit] = useState("Weeks");

  // 📡 Fetch data from API
  useEffect(() => {
    const fetchMemberSummary = async () => {
      try {
        const query = buildFilterQuery(appliedFilters);
        let url = `http://localhost:5092/api/Incident/nameandcountbypriority`;

        const params = new URLSearchParams();

        // 🔍 include filters directly in the URL
        if (query) {
          url += `?${query}`;
        }

        // 📄 Append pagination, sorting, metrics
        params.append("PageNumber", (pageNumber || 1).toString());
        if (pageSize) params.append("PageSize", pageSize.toString());
        if (sortBy) params.append("SortBy", sortBy);
        if (sortOrder) params.append("SortOrder", sortOrder);
        if (metricsUnit) params.append("Metrics", metricsUnit);

        // Combine filters + params
        url += query ? `&${params.toString()}` : `?${params.toString()}`;

        console.log("Final URL:", url);

        const response = await fetch(url);
        const data: MemberDetailsResponse = await response.json();

        setMemberDetailsSummary(data);

        // Sync pagination
        if (data.pagination) {
          setPageNumber(data.pagination.page ?? pageNumber);
          setPageSize(data.pagination.pageSize ?? pageSize);
          setSortBy(data.pagination.sortBy ?? sortBy);
        }
      } catch (error) {
        console.error("Error fetching member summary:", error);
        setMemberDetailsSummary(null);
      }
    };

    fetchMemberSummary();
  }, [appliedFilters, pageNumber, pageSize, sortBy, sortOrder, metricsUnit]);

  // 🧮 Pagination control handlers
  const goToFirstPage = () => setPageNumber(1);
  const goToLastPage = () =>
    setPageNumber(memberDetailsSummary?.pagination?.totalPages ?? 1);
  const goToPreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    const totalPages = memberDetailsSummary?.pagination?.totalPages ?? 1;
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const totalRecords = memberDetailsSummary?.pagination?.totalRecords ?? 0;
  const totalPages = memberDetailsSummary?.pagination?.totalPages ?? 1;

  return (
    <div className="team-portfolio-container">
      {/* Header with Title and Controls */}
      <header className="portfolio-header">
        <h1 style={{ color: "#333B69" }}>Team Member Portfolio</h1>
        <div className="controls">
          <label>
            <b>Metrics in:</b>
          </label>
          <select
            className="restore-arrow"
            value={metricsUnit}
            onChange={(e) => setMetricsUnit(e.target.value)}
          >
            <option value="Weeks">Weeks</option>
            <option value="Days">Days</option>
          </select>

          <label>
            <b>Sort by:</b>
          </label>
          <select
            className="restore-arrow"
            value={sortBy ?? ""}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Recently Updated">Recently Updated</option>
            <option value="Alphabetical">Alphabetical</option>
          </select>
        </div>
      </header>

      {/* Main List of Member Cards */}
      <main className="member-list">
        {memberDetailsSummary?.memberDetails?.length ? (
          memberDetailsSummary.memberDetails.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))
        ) : (
          <p>No data available.</p>
        )}
      </main>

      {/* Footer with Paging Info */}
      <footer className="portfolio-footer">
        <span>
          Page {pageNumber} of {totalPages} ({totalRecords} records)
        </span>
        <div className="pagination">
          {/* First Page */}
          <button
            style={{
              borderRadius: "6px 0 0 6px",
              border: " 1px solid #33303111",
            }}
            className="page-control"
            onClick={goToFirstPage}
            disabled={pageNumber === 1}
          >
            <img src={forward} />
            <img src={forward} />
          </button>

          {/* Previous Page */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}
          >
            <img src={forward} />
          </button>

          {/* Next Page */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToNextPage}
            disabled={pageNumber === totalPages}
          >
            <img src={backward} />
          </button>

          {/* Last Page */}
          <button
            style={{
              borderRadius: "0 6px 6px 0",
              border: " 1px solid #33303111",
            }}
            className="page-control"
            onClick={goToLastPage}
            disabled={pageNumber === totalPages}
          >
            <img src={backward} />
            <img src={backward} />
          </button>
        </div>
      </footer>
    </div>
  );
}
