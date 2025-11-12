import "./member-portfolio.css";
import backward from "../../assets/backward.png";
import forward from "../../assets/forward.png";
import { useAtomValue } from "jotai";
import { appliedFilter } from "../../store/filterStore";
import { useEffect, useState } from "react";
import { buildFilterQuery } from "../../utils/queryBuilder";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { Select } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
// 🧩 Type definitions
interface MemberDetail {
  name: string | null;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  totalCount: number;
  lastUpdated: string;
  actualResolvedTime: string;
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

const TeamMemberCard = ({ member }: { member: MemberDetail }) => (
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

export default function MemberPortfolio() {
  const appliedFilters = useAtomValue(appliedFilter);

  // 🪣 React state
  const [memberDetailsSummary, setMemberDetailsSummary] =
    useState<MemberDetailsResponse | null>(null);

  // 🧭 Pagination/sorting/metrics state
  const [value, setValue] = useState<string | null>("5"); // ✅ allows null

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(5);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("ascending");

  const [loading, setLoading] = useState<boolean>(true);

  // 📡 Fetch data from API
  useEffect(() => {
    const fetchMemberSummary = async () => {
      setLoading(true);
      try {
        const query = buildFilterQuery(appliedFilters);
        let url = `http://localhost:5092/api/Incident/nameandcountbypriority`;

        const params = new URLSearchParams();
        if (query) url += `?${query}`;

        params.append("PageNumber", (pageNumber || 1).toString());
        if (pageSize) params.append("PageSize", pageSize.toString());
        if (sortBy) params.append("SortBy", sortBy);
        if (sortOrder) params.append("SortOrder", sortOrder);

        url += query ? `&${params.toString()}` : `?${params.toString()}`;
        console.log("Final URL:", url);

        const response = await fetch(url);
        const data: MemberDetailsResponse = await response.json();
        setMemberDetailsSummary(data);

        if (data.pagination) {
          setPageNumber(data.pagination.page ?? pageNumber);
          setPageSize(data.pagination.pageSize ?? pageSize);
        }
      } catch (error) {
        console.error("Error fetching member summary:", error);
        setMemberDetailsSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberSummary();
  }, [appliedFilters, pageNumber, pageSize, sortBy, sortOrder]);

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

  // 🔄 Column sort click handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
    } else {
      setSortBy(column);
      setSortOrder("ascending");
    }
  };

  // 🧱 Column configuration for cleaner rendering
  const columns = [
    { label: "Incident Count", key: "totalCount" },
    { label: "Name", key: "name" },
    { label: "P1-Critical", key: "p1" },
    { label: "P2-High", key: "p2" },
    { label: "P3-Moderate", key: "p3" },
    { label: "P4-Low", key: "p4" },
    { label: "Actual Resolved Time", key: "actualResolvedTime" },
  ];

  return (
    <div className="team-portfolio-container">
      {/* Header */}
      <header className="portfolio-header">
        <h1 style={{ color: "#333B69" }}>Team Member Portfolio</h1>
      </header>

      {/* Main List */}
      <main className="member-list">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
        />
        {/* Table Header */}
        <div className="member-card header-row">
          <div className="metrics-grid">
            {columns.map((col) => (
              <div
                key={col.key}
                className="metric-item sortable"
                onClick={() => handleSort(col.key)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  gap: "4px",
                  fontWeight: "600",
                  color: "#333B69",
                  flexDirection: "row",
                }}
              >
                {col.label}
                {sortBy === col.key ? (
                  sortOrder === "ascending" ? (
                    <GoSortAsc size={16} />
                  ) : (
                    <GoSortDesc size={16} />
                  )
                ) : (
                  <GoSortAsc size={16} style={{ opacity: 0.3 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Rows */}
        {memberDetailsSummary?.memberDetails?.length ? (
          memberDetailsSummary.memberDetails.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))
        ) : (
          <p>No data available.</p>
        )}
      </main>

      {/* Footer Pagination */}
      <footer className="portfolio-footer">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
          }}
        >
          <span>
            Page {pageNumber} of {totalPages} ({totalRecords} records)
          </span>
          <span> |  Page size:</span>
          <Select
            style={{ width: "70px" }}
            placeholder="Page size"
            data={["5", "10", "15", "20"]}
            value={pageSize?.toString() ?? "5"} // keep it in sync with state
            onChange={(val) => {
              if (val) {
                setPageSize(Number(val)); // ✅ update page size
                setPageNumber(1); // ✅ reset to first page
              }
            }}
            comboboxProps={{
              position: "bottom",
              middlewares: { flip: false, shift: false },
              offset: 0,
            }}
            styles={{
              input: {
                border: "1px solid #ccc",
                "&:focus": {
                  borderColor: "black",
                },
              },
            }}
          />
        </div>

        <div className="member-portpolio-pagination">
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

          {/* Previous */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}
          >
            <img src={forward} />
          </button>

          {/* Next */}
          <button
            style={{ border: " 1px solid #33303111" }}
            className="page-control"
            onClick={goToNextPage}
            disabled={pageNumber === totalPages}
          >
            <img src={backward} />
          </button>

          {/* Last */}
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
